<template>
  <div>
    <input type="button" 
           name="submit" 
           class="u-btn u-btn-primary mb10" 
           value="添加模板"
           @click="onAddTpl"/>
    <table class="m-table">
        <thead>
            <tr>
                <th>名称</th>
                <th>类型</th>
                <th>描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in tplList">
                <td><a @click.prevent="onEdit(item.id)" href="">{{ item.name }}</a></td>
                <td>{{ item.appType }}</td>
                <td>{{ item.descp }}</td>
                <td class="u-btns">
                  <span class="u-btn u-btn-s1" @click="onAddComponent(item.id)">增加组件</span>
                  <span class="u-btn u-btn-s1" @click="onAddScript(item.id)">添加脚本</span>
                  <span class="u-btn u-btn-s1" @click="onShowAllConfig(item.id)">查看</span>
                  <span class="u-btn u-btn-s1" @click="onDel(item.id)">删除</span>
                </td>
            </tr>
        </tbody>
    </table>
    <pager :total="total" v-ref:pager></pager>
  </div>
  <!-- 添加模板 -->
  <modal :show.sync="showModal" :submit="doAddTpl">
    <h3 slot="header">{{ obj.id?'修改':'添加' }}模板</h3>
    <div slot="body">
      <validator name="validation1">
        <form class="m-form" v-el:form novalidate>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>名称：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="name" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-model="obj.name"
                         v-validate:message="['required']"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>类型：</label>
              <div class="fmcnt">
                  <select class="u-ipt" v-model="obj.appType" name="appType">
                    <option value="{{ key }}" v-for="(key, val) in appTypeList">{{ val }}</option>
                  </select>
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
        </form>
      </validator>
    </div>
  </modal>
  <!-- 添加组件 -->
  <modal :show.sync="showAddComponent" :submit="doAddComponent">
    <h3 slot="header">添加组件</h3>
    <div slot="body">
      <h3>基础组件</h3>
      <form class="m-form" v-el:form>
        <div class="fmitem" v-for="(index, basic) in basicList">
            <label class="fmlab"></label>
            <div class="fmcnt">
                <select class="u-ipt" 
                        v-model="basic.packageId"
                        @change="changePackage(basic.packageId, index)">
                  <option value="">请选择</option>
                  <option value="{{ item.id }}" 
                          v-for="item in packageList">{{ item.name }}</option>
                </select>
                <select class="u-ipt"
                        v-model="basic.configId">
                  <option value="">请选择</option>
                  <option value="{{ item.id }}" 
                          v-for="item in basic.configList">{{ item.name }}</option>
                </select>
                <i class="iconfont icon-add"
                   v-if="index==basicList.length-1"
                   @click="addRow"></i>
            </div>
        </div>
      </form>
    </div>
  </modal>
  <!-- 添加脚本 -->
  <modal :show.sync="showAddScript" :submit="doAddScript">
    <h3 slot="header">添加脚本</h3>
    <div slot="body">
      <form class="m-form" v-el:form>
        <div class="fmitem">
            <label class="fmlab">名称：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="name" 
                       class="u-ipt"
                       disabled
                       v-model="tplObj.name"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">描述：</label>
            <div class="fmcnt">
                <textarea class="u-ipt"
                          name="descp"
                          v-model="tplObj.descp">
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
    </div>
  </modal>
  <!-- 查看配置 -->
  <modal :show.sync="showAllConfig" :bottom-bar="false">
    <h3 slot="header">查看配置</h3>
    <div slot="body">
        <h3 class="title">组件信息</h3>
        <ul class="m-view-config" v-if="views.length!=0">
          <li v-for="(index, item) in views" class="j-li">
            <p>
              {{ index+1 }}. {{ item.baseSoftwareName }}({{item.baseSoftwareConfigName}})
              <i class="iconfont icon-del-2" title="删除" @click="delComponent(item.templateSoftwareId)"></i>
            </p>
          </li>
        </ul>
        <p v-else class="no-data">无</p>
        <h3 class="title">脚本信息</h3>
        <ul class="m-view-config" v-if="templateFiles.length!=0">
          <li v-for="(index, item) in templateFiles" class="j-li">
            <p>
              {{ index+1 }}. {{ item.fileName }}
              <a href="/api/template/config/file/download/{{item.id}}">
                <i class="iconfont icon-download" title="下载"></i>
              </a>
              <i class="iconfont icon-del-2" title="删除" @click="delScript(item.id)"></i>
            </p>
          </li>
        </ul>
        <p v-else class="no-data">无</p>
    </div>
  </modal>
  <!-- 删除 -->
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除模板</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该模板么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import select from 'src/components/Select.vue'
  import modal from 'src/components/Modal.vue'
  import upload from 'src/components/Upload.vue'
  import pager from 'src/components/Pager.vue'
  import * as service from 'src/service/sysConfig/templateManage'
  import { searchPackageByWord, getAllConfig } from 'src/service/sysConfig/basicPartManage'

  export default {
    components: { 
      vSelect: select,
      modal: modal,
      upload: upload,
      pager: pager
    },
    data () {
      return {
        appTypeList: [],
        tplList: [],
        total: 1,
        //添加组件页面
        configId: '',
        packageId: '',
        basicList: [{
          packageId: this.packageId||'',
          configId: this.configId||'',
          configList: []
        }],
        packageList: [],
        configList: [],
        //查看配置页面
        templateFiles: [],
        views: [],

        showModal: false,
        showAddComponent: false,
        showAddScript: false,
        showAllConfig: false,
        showDelModal: false,

        fileName: '',
        obj: this.initObj(),
        tplObj: this.initTplObj(),
        check: false
      }
    },
    ready(){
      this.getTplList();

      this.$refs.pager.$on('on-change', function(page){
        this.getTplList(page);
      }.bind(this));
    },
    watch : {
      'configId': function(val, oldVal){
        console.log(val);
      },
      'fileName': function(val, oldVal){
        this.tplObj.name = val;
      }
    },
    methods: {
      getTplList(num) {
        service.getTplList({
          pageSize: 10,
          pageNumber: num || 1
        }).then((data) => {
          this.tplList = data.result || [];
          this.total = data.total;
        });
      },
      //获取应用类型
      getAppType() {
        service.getAppType({})
          .then((data) => {
            this.appTypeList = data || {};
          });
      },
      initObj(){
        return {
          appType: 'javaweb',
          name: '',
          descp: '',
          id: ''
        }
      },
      initTplObj(){
        return {
          templateId: '',
          name: '',
          descp: '',
          file: ''
        }
      },
      initComObj(){
        return {
          packageId: this.packageId||'',
          configId: this.configId||'',
          configList: []
        }
      },
      //点击添加模板
      onAddTpl(){
        this.getAppType();
        this.check = false;
        this.$resetValidation();
        this.id = '';
        this.showModal = true;
        this.obj = this.initObj();
      },
      onEdit(id) {
        this.obj.id = id;
        this.showModal = true;
        this.getAppType();

        service.get(id)
          .then((data) => {
            this.obj = data || {};
          });
      },
      //保存添加模板
      doAddTpl(){
        this.check = true;
        if (this.$validation1.invalid){
          Vue.$alert('请填写必填项', 'danger');
          return;
        }

        if (!!this.obj.id){

          service.edit(this.obj)
            .then((data) => {
              Vue.$alert('修改模板成功', 'success');
              this.showModal = false;
              this.getTplList();
            });
        }else{

          service.add(this.obj)
            .then((data) => {
              Vue.$alert('添加模板成功', 'success');
              this.showModal = false;
              this.getTplList();
            });
        }
      },
      //获取所有基础组件包
      getPackageList() {
        searchPackageByWord({
          searchword:''
        }).then((data) => {
          this.packageList = data.list || [];
        });
      },
      //切换组件包
      changePackage(id, index) {
        this.getConfigList(id, index);
      },
      //获取某一个组件包下的配置
      getConfigList(id, index) {
        let self = this;
        if (!id){
          this.configList = [];
          return;
        }
        getAllConfig({
          baseSoftwareId: id
        }).then((data) => {
          self.basicList[index].configList = data.list||[];
        });
      },
      //添加一个组件
      addRow() {
        this.basicList.push(this.initComObj());
      },
      //点击增加组件
      onAddComponent(id) {
        this.id = id;
        this.showAddComponent = true;
        this.getPackageList();
      },
      //增加组件-- 确定
      doAddComponent() {
        let configIdList = [];
        this.basicList.forEach((item) => {
          item.configId && configIdList.push(item.configId);
        });

        if (configIdList.length==0){
          Vue.$alert('请至少选择一个组件', 'danger');
          return;
        }
        let data = {
          templateId: this.id,
          softwareConfigId: configIdList
        }
        service.addComponent(data)
          .then((data) => {
            Vue.$alert('添加组件成功', 'success');
            this.showAddComponent = false;
          });
      },
      //点击删除模板
      onDel(id) {
        this.id = id;
        this.showDelModal = true;
      },
      //确定删除
      doDel() {
        service.del(this.id)
          .then((data) => {
            Vue.$alert('删除模板成功', 'success');
            this.showDelModal = false;
            this.getTplList();
          });
      },
      //点击添加脚本
      onAddScript(id) {
        this.id = id;
        this.showAddScript = true;

        this.$els.form.file.value = '';
        this.fileName = '';
        this.tplObj = this.initTplObj();
      },
      //保存 -- 添加脚本
      doAddScript() {
        let data = new FormData(this.$els.form);
        if (!this.fileName){
          Vue.$alert('请上传文件', 'danger');
          return;
        }
        data.append('templateId', this.id);

        service.addScript(data)
          .then((data) => {
            Vue.$alert('添加脚本成功', 'success');
            this.showAddScript = false;
          });
      },
      //点击查看配置
      onShowAllConfig(id) {
        this.showAllConfig = true;
        this.id = id;

        service.getAllConfig(id)
          .then((data) => {
            this.templateFiles = data.templateFiles||[];
            this.views = data.views||[];
          });
      },
      //删除脚本
      delScript(id) {
        service.delScript(id).then((data) => {
          Vue.$alert('删除脚本成功', 'success');
          this.onShowAllConfig(this.id);
        });
      },
      //删除组件
      delComponent(id) {
        service.delComponent(id)
          .then((data) => {
            Vue.$alert('删除组件成功', 'success');
            this.onShowAllConfig(this.id);
          });
      }
    },
    events: {

    }
  }
</script>

<style lang="less" scoped>

</style>
