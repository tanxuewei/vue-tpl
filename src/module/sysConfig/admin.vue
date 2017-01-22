<template>
  <div>
    <div class="mb10">
        <input type="text"
               class="u-ipt"
               placeholder="输入姓名或邮箱前缀搜索" 
               @keyup="keyupIpt($event)"
               v-model="searchWord">
        <input type="button" 
               name="" 
               class="u-btn u-btn-primary ml30" 
               value="搜索"
               @click="search('refresh')"/>
    </div>
    <table class="m-table">
        <thead>
            <tr>
                <th>姓名</th>
                <th>邮箱前缀</th>
                <th>工号</th>
                <th>是否管理员</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in adminList">
                <td>{{ item.userName }}</td>
                <td>{{ item.account }}</td>
                <td>{{ item.jobNumber }}</td>
                <td>{{ item.isAdmin==1?'是':'否' }}</td>
                <td>
                    <span v-if="item.isAdmin==0" class=" u-btn u-btn-s1" @click="onAdd(item.account)">添加管理员</span>
                    <span v-else class=" u-btn u-btn-s1" @click="onDel(item.account)">删除管理员</span>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="table-no-data" v-if="!first && adminList.length==0">暂无数据</p>
    <pager :total="total" v-ref:pager v-if="showPage"></pager>
  </div>
  <modal :show.sync="showModal" :submit="doAdd">
    <h3 slot="header">添加管理员</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定添加为管理员？</p>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除管理员</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除管理员？</p>
    </div>
  </modal>
</template>
<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import pager from 'src/components/Pager.vue'
  import _ from 'src/base/util'

  import * as service from 'src/service/sysConfig/admin'

  export default {
    components: { 
      modal: modal,
      pager: pager
    },
    data () {
      return {
        adminList: [],
        nosList: [],
        account: '',
        showModal: false,
        showDelModal: false,
        searchWord: '',
        total: 1,
        first: true
      }
    },
    computed: {
      showPage(){
        return this.total>10?true:false;
      }
    },
    watch: {
      'total': function(val){
        if (val>10 && this.$refs.pager){

          this.$refs.pager.$on('on-change', function(page){
            this.getAdminList(page);
          }.bind(this));
          return true;
        }
      }
    },
    ready(){
      this.getAdminList(1, 'init');
    },
    methods: {
      getAdminList(num, type) {

        service.getAdminList({
          pageSize: 10,
          pageNumber: num || 1
        }).then((data) => {
          this.adminList = data.list||[];
          this.total = data.total;
          (type=='init') && (this.first = false);
        });
      },
      keyupIpt(e) {
        //回车事件处理
        if (e.which == 13){
          this.search();
        }
      },
      search(){
        if (!this.searchWord) {
          this.getAdminList(1);
          return;
        }
        service.searchUser({
          keyWord: this.searchWord
        }).then((data) => {
          this.adminList = data.list || [];
          this.total = data.total || 1;
        });
      },
      onAdd(account) {
        this.account = account;
        this.showModal = true;
      },
      doAdd(){
        service.setAdmin(this.account)
          .then((data) => {
            Vue.$alert('设置管理员成功', 'success');
            this.searchWord = '';
            this.showModal = false;
            this.account = '';
            this.getAdminList(1);
          });
      },
      onDel(account){
        this.account = account;
        this.showDelModal = true;
      },
      doDel() {
        
        service.cancelAdmin(this.account)
          .then((data) => {
            Vue.$alert('删除管理员成功', 'success');
            this.searchWord = '';
            this.showDelModal = false;
            this.account = '';
            this.getAdminList(1);
          });
      },
    },
    events: {

    }
  }
</script>

<style lang="less" scoped>
  
</style>
