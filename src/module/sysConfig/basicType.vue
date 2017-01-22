<template>
  <div>
    <input type="button" 
           name="submit" 
           class="u-btn u-btn-primary mb10" 
           value="添加类型"
           @click="add"/>
    <table class="m-table">
        <thead>
            <tr>
                <th>名称</th>
                <th>描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="type in typeList">
                <td>{{ type.name }}</td>
                <td>{{ type.descp }}</td>
                <td>
                    <i class="iconfont icon-edit" @click="edit(type.id)" title="编辑"></i>
                    <i class="iconfont icon-del" @click="onDel(type.id)" title="删除" style="margin-left: 5px;"></i>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
  <modal :show.sync="showModal" :submit="doSubmit">
    <h3 slot="header">{{ obj.id?'修改':'添加' }}类型</h3>
    <div slot="body">
      <validator name="validation1">
        <form class="m-form" onsubmit="return false" novalidate>
          <div class="fmitem">
              <label class="fmlab"><i>*</i>名称：</label>
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
              <label class="fmlab">描述：</label>
              <div class="fmcnt">
                  <textarea class="u-ipt"
                            v-model="obj.descp">
                  </textarea>
              </div>
          </div>
        </form>
      </validator>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除类型</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该类型么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/sysConfig/basicPartManage'

  export default {
    components: { modal },
    props: {
      value : {
        type: String
      }
    },
    data () {
      return {
        typeList: [],
        showModal: false,
        showDelModal: false,
        obj: this.initObj(),
        check: false
      }
    },
    ready(){
      this.getAllType();
    },
    methods: {
      initObj() {
        return {
          name: '',
          descp: '',
          id: ''
        }
      },
      //获取所有的基础类型
      getAllType(){

        service.getAllType({})
          .then((data) => {
            this.typeList = data.list || [];
          });
      },
      add() {
        this.check = false;
        this.$resetValidation();
        this.showModal = true;
        this.obj = this.initObj();
      },
      edit(id){
        this.obj.id = id;
        service.getType({ 
          id: id 
        }).then((data) => {
          this.showModal = true;
          this.obj = data;
        });
      },
      doSubmit(){
        this.check = true;
        if (this.$validation1.invalid){
          Vue.$alert('请填写必填项', 'danger');
          return;
        }

        service.addType(this.obj).then((data) => {
          this.showModal = false;
          this.getAllType();
        });
      },
      onDel(id){
        this.showDelModal = true;
        this.delId = id;
      },
      doDel() {
        
        service.delType({ 
          ids: this.delId 
        }).then((data) => {
          this.showDelModal = false;
          this.delId = '';
          this.getAllType();
        });
      },
    },
    events: {
      
    }
  }
</script>

<style lang="less" scoped>
  
</style>
