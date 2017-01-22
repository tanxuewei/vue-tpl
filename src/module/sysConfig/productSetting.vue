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
                <th>产品</th>
                <th>nos存储</th>
                <th>构建集群</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in proList">
                <td>{{ item.productName }}</td>
                <td>{{ item.nosName }}</td>
                <td title="{{ item.clusterName }}">{{ item.clusterName }}</td>
                <td>
                    <i class="iconfont icon-setting" @click="edit(item.id)" title="设置"></i>
                    <i class="iconfont icon-del" @click="onDel(item.id)" title="删除" style="margin-left: 5px;"></i>
                </td>
            </tr>
        </tbody>
    </table>
    <pager :total="total" v-ref:pager></pager>
  </div>
  <modal :show.sync="showModal" :submit="doSubmit" :modalclazz="'modal-no-auto'">
    <h3 slot="header">添加NOS</h3>
    <div slot="body">
      <form class="m-form">
        <div class="fmitem">
            <label class="fmlab"><i>*</i>产品名称：</label>
            <div class="fmcnt">
                <v-select :value.sync="obj.productId" :options.sync="allProList" search justified></v-select>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">nos存储：</label>
            <div class="fmcnt">
                <v-select :value.sync="obj.nosConfigId" :options.sync="nosList" justified></v-select>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">构建集群：</label>
            <div class="fmcnt">
                <v-select :value.sync="obj.buildServerClusterId" :options.sync="clusterList" justified></v-select>
            </div>
        </div>
      </form>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除产品配置</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该产品配置么？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import select from 'src/components/Select.vue'
  import pager from 'src/components/Pager.vue'
  import _ from 'src/base/util'

  import * as service from 'src/service/sysConfig/productSetting'
  import { getAllProductList } from 'src/service/common'
  import { getAllNos } from 'src/service/sysConfig/nosStoreManage'
  import { getAllServer } from 'src/service/sysConfig/buildServerManage'

  export default {
    components: { 
      modal: modal,
      vSelect: select,
      pager: pager
    },
    data () {
      return {
        proList: [],
        allProList: [],
        nosList: [],
        clusterList: [],
        showModal: false,
        showDelModal: false,
        obj: this.initObj(),
        total: 1
      }
    },
    ready(){
      this.getList();
      this.getAllProductList();
      this.getAllNos();
      this.getClusterList();

      this.$refs.pager.$on('on-change', function(page){
        this.getList(page);
      }.bind(this));
    },
    methods: {
      getList(num) {

        service.getList({
          pageSize: 10,
          pageNumber: num || 1
        }).then((data) => {
          this.proList = data.result||[];
          this.total = data.total;
        });
      },
      getAllProductList(){

        getAllProductList({})
          .then((data) => {
            this.allProList = _.optionsData(data.list||[], 'productId', 'productName');
          });
      },
      getAllNos(){

        getAllNos({})
          .then((data) => {
            this.nosList = _.optionsData(data.list||[], 'id', 'name');
            this.nosList.unshift({value:'请选择', label:'请选择'})
          });
      },
      getClusterList() {

        getAllServer({})
          .then((data) => {
            this.clusterList = _.optionsData(data.list||[], 'clusterId', 'clusterName');
            this.clusterList.unshift({value:'请选择', label:'请选择'})
          });
      },
      initObj() {
        return {
          productId: '',
          nosConfigId: '',
          buildServerClusterId: '',
          id: ''
        }
      },
      add() {
        this.showModal = true;
        this.obj = this.initObj();
      },
      edit(id){
        
        service.get(id)
          .then((data) => {
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
            Vue.$alert('删除成功', 'success');
            this.showDelModal = false;
            this.delId = '';
            this.getList();
          });
      },
      doSubmit(){
        if (!this.obj.productId){
          Vue.$alert('请选择产品', 'danger');
          return;
        }
        service.add(this.obj)
          .then((data) => {
            Vue.$alert('操作成功', 'success');
            this.showModal = false;
            this.getList();
          });
      },
    },
    events: {

    }
  }
</script>

<style lang="less" scoped>
  
</style>
