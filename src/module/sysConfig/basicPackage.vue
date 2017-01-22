<template>
  <div>
    <form class="m-form">
        <div class="fmitem">
            <label class="fmlab">类型</label>
            <div class="fmcnt">
                <v-select :value.sync="value" :options.sync="options"></v-select>
                <input type="button" 
                       name="" 
                       class="u-btn u-btn-primary ml30" 
                       value="添加基础件"
                       @click="onAddPackage"/>
            </div>
        </div>
    </form>
    <table class="m-table">
        <thead>
            <tr>
                <th>名称</th>
                <th>描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in packageList">
                <td><a @click.prevent="onEditPackage(item.id)" href="">{{ item.name }}</a></td>
                <td>{{ item.descp }}</td>
                <td class="u-btns">
                  <span class="u-btn u-btn-s1" @click="onAddConfig(item.id)">增加配置</span>
                  <span class="u-btn u-btn-s1" @click="onShowAllConfig(item.id)">查看配置</span>
                  <span class="u-btn u-btn-s1" @click="onDel(item.id)">删除</span>
                  <a class="u-btn u-btn-s1" href="/api/software/base/download/{{ item.id }}">下载</a>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
  <!-- 添加基础件 -->
  <modal :show.sync="showModal" :submit="doAddPackage">
    <h3 slot="header">{{ id?'修改':'添加'}}基础件</h3>
    <div slot="body">
      <form class="m-form" v-el:form>
        <div class="fmitem">
            <label class="fmlab"><i>*</i>类型：</label>
            <div class="fmcnt">
                <select class="u-ipt" 
                        v-if="!id"
                        v-model="obj.typeId" 
                        name="typeId">
                  <option value="">请选择</option>
                  <option value="{{ item.id }}" v-for="item in options">{{ item.name }}</option>
                </select>
                <span v-else>{{ packageName }}</span>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">名称：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="name" 
                       class="u-ipt"
                       v-model="obj.name"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">描述：</label>
            <div class="fmcnt">
                <textarea class="u-ipt"
                          name="descp"
                          v-model="obj.descp">
                </textarea>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">文件：</label>
            <div class="fmcnt">
                <upload :file-name.sync="fileName" v-if="!id"></upload>
                {{ obj.fileName }}
                <a v-if="id && obj.id" 
                   href="/api/software/base/download/{{ obj.id }}"
                   class="ml10">
                  <i class="iconfont icon-download" title="下载"></i>
                </a>
            </div>
        </div>
      </form>
    </div>
  </modal>
  <!-- 增加配置 -->
  <modal :show.sync="showAddConfig" 
         :submit="isFirstSubmit==true?doAddConfig:doAddPlaceholder" 
         :modalclazz="isFirstSubmit==true?'':'modal-mid'">
    <h3 slot="header">增加配置</h3>
    <div slot="body">
      <form class="m-form" v-el:formadd v-show="isFirstSubmit==true">
        <div class="fmitem">
            <label class="fmlab">名称：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="name" 
                       class="u-ipt"
                       v-model="obj.name"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">描述：</label>
            <div class="fmcnt">
                <textarea class="u-ipt"
                          name="descp"
                          v-model="obj.descp">
                </textarea>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">文件：</label>
            <div class="fmcnt">
                <upload :file-name.sync="fileName"></upload>
            </div>
        </div>
      </form>
      <form class="m-form" v-show="isFirstSubmit==false">
        <div class="fmitem">
            <label class="fmlab">名称：</label>
            <div class="fmcnt">
                {{ obj.name }}
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">描述：</label>
            <div class="fmcnt">
                {{ obj.descp }}
            </div>
        </div>
        <placeholader :placeholder-list="placeholderList"></placeholader>
      </form>
    </div>
  </modal>
  <modal :show.sync="showAllConfig" 
         :bottom-bar="false"
         :modalclazz="showPlaceholder==false?'':'modal-mid'">
    <h3 slot="header">查看配置</h3>
    <div slot="body">
        <ul class="m-view-config" v-if="allConfigList.length!=0">
          <li v-for="(index, item) in allConfigList" class="j-li">
            <p>
              {{ index+1 }}. {{ item.name }}
              <a href="/api/software/config/download/{{item.id}}">
                <i class="iconfont icon-download" title="下载"></i>
              </a>
              <i 
                  class="iconfont icon-arrow-bottom"
                  title="展开"
                  @click="getPlaceholder(item.id)"></i>
              <i 
                  class="iconfont icon-del-2" 
                  title="删除"
                  @click="delConfig(item.id)"></i>
            </p>
            <div class="m-form" v-if="item.id==placeholderId">
              <placeholader :placeholder-list="oneOfPHList"></placeholader>
              <div class="fmitem" v-if="oneOfPHList.length!=0">
                  <label class="fmlab"></label>
                  <div class="fmcnt">
                      <input type="button" 
                             class="u-btn u-btn-primary" 
                             value="保存"
                             @click="save()"/>
                  </div>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no-data">暂无配置</p>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除类型</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该基础包么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import select from 'src/components/Select.vue'
  import modal from 'src/components/Modal.vue'
  import upload from 'src/components/Upload.vue'
  import placeholader from './basicPlaceholder.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/sysConfig/basicPartManage'

  export default {
    components: { 
      vSelect: select,
      modal: modal,
      upload: upload,
      placeholader: placeholader
    },
    data () {
      return {
        id: '',
        value: '',
        options: [],
        packageList: [],
        allConfigList: [],
        placeholderList: [],
        showModal: false,
        showAddConfig: false,
        showAllConfig: false,
        showDelModal: false,
        //是否是第一次
        isFirstSubmit: true,
        fileName: '',
        obj: this.initObj(),
        packageName: '',
        //查看配置
        showPlaceholder: false,
        placeholderId: 0,
        oneOfPHList: []
      }
    },
    ready(){
      this.getAllType();
    },
    watch: {
      'value': function(val, oldVal){
        this.search(val);
        this.getPackageName(val);
      }
    },
    methods: {
      //获取所有的基础包类型
      getAllType() {

        service.getAllType({})
          .then((data) => {            
            this.options = _.optionsData(data.list||[], 'id', 'name');
          });
      },
      search(val){
        let params = {
          typeId: val,
          pageSize: 10,
          pageNumber: 1
        }
        if (!val){
          this.packageList = [];
          return;
        }
        service.searchPackage(params)
          .then((data) => {
            this.packageList = data.result || [];
          });
      },
      getPackageName(val) {
        let obj = _.findInMap(this.options, 'id', val);
        this.packageName = obj?obj.name:'';
      },
      initObj(){
        return {
          typeId: '',
          name: '',
          descp: '',
          file: '',
          fileName: ''
        }
      },
      onAddPackage(){
        this.id = '';
        this.showModal = true;
        this.obj = this.initObj();
        this.$els.form.file && (this.$els.form.file.value = '');
        this.fileName = '';
      },
      onEditPackage(id) {
        this.id = id;
        this.showModal = true;
        service.getPackage(id)
          .then((data) => {
            this.obj = data || {};
          });
      },
      doAddPackage(){
        //验证类型
        if (!this.obj.typeId){
          Vue.$alert('请选择类型', 'danger');
          return;
        }
        if (!this.fileName){
          Vue.$alert('请上传文件', 'danger');
          return;
        }
        if (!!this.id){
          if (!this.obj.name){
            Vue.$alert('请输入名称', 'danger');
            return;
          }
          service.updatePackage(this.obj)
            .then((data) => {
              Vue.$alert('修改成功', 'success');
              this.showModal = false;
              this.search(this.value);
            });
        }else{
          let data = new FormData(this.$els.form);

          service.addPackage(data)
            .then((data) => {
              Vue.$alert('添加成功', 'success');
              this.showModal = false;
              this.search(this.value);
            });
        }
      },
      //点击增加配置
      onAddConfig(id) {
        this.showAddConfig = true;
        this.selId = id;
        this.obj = {
          typeId: '',
          name: '',
          descp: ''
        }
        this.$els.formadd.file.value = '';
        this.fileName = '';
      },
      //增加配置-- 确定
      doAddConfig() {
        let data = new FormData(this.$els.formadd);
        if (!this.fileName){
          Vue.$alert('请上传文件', 'danger');
          return;
        }

        data.append('baseSoftwareId', this.selId);

        service.addConfig(data)
          .then((data) => {
            this.isFirstSubmit = false;
            this.placeholderList = data.list || [];
            this.placeholderList.map((item) => {
              item.dataType = item.dataType?item.dataType:'STRING';
              return item;
            });
          });
      },
      //增加配置-- 占位符确定
      doAddPlaceholder(type) {
        let list = (type=="show"?this.oneOfPHList:this.placeholderList);

        service.updatePlaceholder(list)
          .then((data) => {
            Vue.$alert('保存成功', 'success');
            this.showAddConfig = false;
            this.isFirstSubmit = true;
          });
      },
      //点击查看配置
      onShowAllConfig(id) {
        this.showAllConfig = true;
        this.baseId = id;
        this.placeholderId = 0;

        service.getAllConfig({
          baseSoftwareId: id
        }).then((data) => {
          this.allConfigList = data.list || [];
        });
      },
      //查看配置 -- 某一个配置包占位符详情
      getPlaceholder(id) {
        this.showPlaceholder = true;
        if (this.placeholderId == id){
          this.placeholderId = 0;
        }else{
          this.placeholderId = id;
          service.getPlaceholder(id)
            .then((data) => {
              this.oneOfPHList = data.list || [];
            });
        }
      },
      //保存占位符
      save() {
        if (!this.placeholderId) return;
        this.doAddPlaceholder('show');
      },
      //删除配置包
      delConfig(id) {
        service.delConfig(id)
          .then((data) => {
            Vue.$alert('删除成功', 'success');
            this.onShowAllConfig(this.baseId);
          });
      },
      //点击删除基础包
      onDel(id) {
        this.baseId = id;
        this.showDelModal = true;
      },
      //确定删除
      doDel() {
        service.delPackage(this.baseId)
          .then((data) => {
            Vue.$alert('删除成功', 'success');
            this.showDelModal = false;
            this.search(this.value);
          });
      }
    },
    events: {

    }
  }
</script>

<style lang="less">
.m-view-config {
  line-height: 25px;
  margin-bottom: 20px;
  .j-li {
    border: 1px dashed #ccc;
    border-bottom: none;
    padding: 0 10px;
    &:last-child {
      border-bottom: 1px dashed #ccc;
    }
  }
  p {
    i {
      margin-left: 15px;
      font-size: 14px;
      &.icon-del-2 {
        font-size: 12px;
      }
    }
  }
}
</style>
