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
                <th>配置名</th>
                <th>桶名</th>
                <th>地址</th>
                <th>扩充地址</th>
                <th>Access Key</th>
                <th>Secret Key</th>
                <th>默认配置</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in nosList">
                <td>{{ item.name }}</td>
                <td>{{ item.bucketName }}</td>
                <td title="{{ item.endpoint }}">{{ item.endpoint }}</td>
                <td title="{{ item.endpointExt }}">{{ item.endpointExt }}</td>
                <td title="{{ item.accessKey }}">{{ item.accessKey }}</td>
                <td title="{{ item.secretKey }}">{{ item.secretKey }}</td>
                <td>
                  <span v-if="item.isDefault==1">是</span>
                  <span v-else>否</span>
                </td>
                <td>
                    <i class="iconfont icon-edit" @click="edit(item.id)" title="编辑"></i>
                    <i class="iconfont icon-del" @click="onDel(item.id)" title="删除" style="margin-left: 5px;"></i>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
  <modal :show.sync="showModal" :submit="doSubmit">
    <h3 slot="header">{{ obj.id?'修改':'添加' }}NOS</h3>
    <div slot="body">
      <validator name="validation1">
        <form class="m-form" novalidate>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>配置名：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-validate:name="['required']"
                         v-model="obj.name"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>桶名：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-validate:bucketName="['required']"
                         v-model="obj.bucketName"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>地址：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-validate:endpoint="['required']"
                         v-model="obj.endpoint"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab">扩充地址：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         v-model="obj.endpointExt"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>Access Key：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-validate:accessKey="['required']"
                         v-model="obj.accessKey"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>Secret Key：</label>
              <div class="fmcnt">
                  <input type="text" 
                         name="" 
                         class="u-ipt"
                         :class="{'check': check==true}"
                         v-validate:secretKey="['required']"
                         v-model="obj.secretKey"/>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>默认配置：</label>
              <div class="fmcnt">
                  <select class="u-ipt"
                          v-model="obj.isDefault">
                      <option value="1">是</option>
                      <option value="0">否</option>
                  </select>
              </div>
          </div>
        </form>
      </validator>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除类型</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该NOS么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import * as service from 'src/service/sysConfig/nosStoreManage'

  export default {
    components: { 
      modal: modal 
    },
    data () {
      return {
        nosList: [],
        showModal: false,
        showDelModal: false,
        obj: this.initObj(),
        check: false
      }
    },
    ready(){
      this.getAllNos();
    },
    methods: {
      //获取所有的nos
      getAllNos(){
        
        service.getAllNos({})
          .then((data) => {
            this.nosList = data.list || [];
          });
      },
      initObj() {
        return {
          name: '',
          bucketName: '',
          endpoint: '',
          endpointExt: '',
          accessKey: '',
          secretKey: '',
          isDefault: 0,
          id: ''
        }
      },
      add() {
        this.check = false;
        this.$resetValidation();
        this.showModal = true;
        this.obj = this.initObj();
      },
      edit(id){
        this.obj.id = id;
        service.get(id).
          then((data) => {
            this.showModal = true;
            this.obj = data;
          });
      },
      onDel(id){
        this.showDelModal = true;
        this.delId = id;
      },
      doDel() {
        
        service.del(this.delId)
          .then((data) => {
            this.showDelModal = false;
            this.delId = '';
            this.getAllNos();
          });
      },
      doSubmit(){
        this.check = true;
        if (this.$validation1.invalid){
          Vue.$alert('请填写必填项', 'danger');
          return;
        }
        if (!!this.obj.id){

          service.edit(this.obj)
            .then((data) => {
              this.showModal = false;
              this.getAllNos();
            });
        }else{

          service.add(this.obj)
            .then((data) => {
              this.showModal = false;
              this.getAllNos();
            });
        }
      },
    },
    events: {

    }
  }
</script>

<style lang="less" scoped>
  
</style>
