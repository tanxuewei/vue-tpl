<template>
  <div>
    <input type="button" 
           name="submit" 
           class="u-btn u-btn-primary mb10" 
           value="添加"
           @click="add"/>
    <table class="m-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>密钥对名称</th>
                <th>密钥对生成时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in secretKeyList">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.modifyTime | moment "YYYY-MM-DD HH:mm:ss" }}</td>
                <td>
                    <i class="iconfont icon-edit" @click="edit(item.id)" title="编辑"></i>
                    <i class="iconfont icon-del" @click="del(item.id)" title="删除" style="margin-left: 5px;"></i>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
  <modal :show.sync="showModal" :submit="doSubmit" :modalclazz="'modal-mid'">
    <h3 slot="header">导入密钥</h3>
    <div slot="body">
      <validator name="validation1">
        <form class="m-form" novalidate>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>密钥对名称：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="name" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-model="obj.name"
                         v-validate:name="['required']"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>私钥内容：</label>
              <div class="fmcnt">
                  <upload :file-name="fileName" :file-txt.sync="obj.privateKey" :show="true"></upload>
                  <p>您可以添加文件，或将私钥内容直接粘贴在下方的输入框内,不支持带密码的私钥</p>
                  <textarea class="u-ipt u-mid"
                            name="descp"
                            :class="{'check': check==true}"
                            v-model="obj.privateKey"
                            v-validate:privateKey="['required']">
                  </textarea>
              </div>
          </div>
        </form>
      </validator>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除密钥</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该密钥么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import select from 'src/components/Select.vue'
  import modal from 'src/components/Modal.vue'
  import upload from 'src/components/Upload.vue'
  import * as service from 'src/service/userConfig/secretKey'

  export default {
    components: { 
      vSelect: select,
      modal: modal,
      upload: upload
    },
    data () {
      return {
        proList: [],
        secretKeyList: [],
        showModal: false,
        showDelModal: false,
        fileName: '',
        fileTxt: '',
        obj: this.initObj(),
        check: false
      }
    },
    ready() {
      this.getList();
    },
    methods: {
      initObj() {
        return {
          name: '',
          privateKey: '',
          id: ''
        }
      },
      getList() {

        service.getList({})
          .then((data) => {
            this.secretKeyList = data.result || [];
          });
      },
      add() {
        this.check = false;
        this.$resetValidation();
        this.obj = this.initObj();
        this.obj.productId = this.proList[0]?this.proList[0].productId:'';
        this.showModal = true;
      },
      edit(id) {

        service.get(id)
          .then((data) => {
            this.showModal = true;
            this.obj = data;
          });
      },
      doSubmit() {
        this.check = true;
        if (this.$validation1.invalid){
          Vue.$alert('请填写必填项', 'danger');
          return;
        }
        service.add(this.obj)
          .then((data) => {
            Vue.$alert('操作成功', 'success');
            this.showModal = false;
            this.getList();
          });
      },
      del(id) {
        this.id = id;
        this.showDelModal = true;
      },
      doDel() {

        service.del(this.id)
          .then((data) => {
            this.showDelModal = false;
            this.getList();
          });
      },
    },
    events: {
      
    }
  }
</script>
<style lang="less" scoped>
textarea.u-mid {
  margin-top: 10px;
}

  
</style>