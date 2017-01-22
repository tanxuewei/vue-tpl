<template>
<div class="wrap" v-if="$route.query.productId">
  <nav>
    <div class="u-iptsearch">
        <input type="text" 
          class="u-ipt u-ipt-s"
          v-model="searchWord"
          @input="search(searchWord)"
          placeholder="按应用搜索" /></div>
    <ul>
      <li v-for="item in appList">
          <a :class="{'act': $route.query.appId == item.applicationId}"
             title="{{ item.applicationName }}"
             @click="selectApp(item.applicationId,item.applicationName)"
             v-link="{path: '/'+$route.name, exact: true, query: {'appId': item.applicationId, 'productId': $route.query.productId}}">{{ item.applicationName }}</a>
      </li>
      <p v-if="noAppList" class="no-data">无应用</p>
    </ul>
  </nav>
  <div class="m-home" v-if="$route.query.appId">
    <router-view></router-view>
  </div>
  <div class="m-home" v-if="$route.query.productId && !$route.query.appId">请选择左侧的应用哟~</div>
</div>
<div class="no-data" v-else>请选择左侧的产品呦~</div>
</template>

<script>
  import { getAppList, getFollowedAppList, getClusterList } from 'src/service/common'
  import _ from 'src/base/util'

  export default {
    data () {
      return {
        appList: [],
        appName: '',
        noAppList: false,
        searchWord: '',
        clusterList: [],
        clusterName: '',
        children: this.$children[0]
      }
    },
    ready() {
      this.appList = [];
      let pId = this.$route.query.productId;
      let clusterId = this.$route.query.clusterId;
      pId && this.getAppList(pId);
    },
    watch: {
      'clusterName': function(val, oldVal){
        this.$children[0] && (this.$children[0].clusterName = val);
        this.$children[0] && this.$children[0].$children[0] && (this.$children[0].$children[0].clusterName = val);
      },
    },
    methods: {
      getAppList(id) {
        if (this.$route.name == 'follow/list'){
          getFollowedAppList(id)
            .then((data) => {
              this.appList = data.list || [];
              this.noAppList= this.appList.length==0 ? true : false;
              this.doGetAppName();
            });
        }else{
          getAppList({ productId: id })
            .then((data) => {
              this.allAppList = data.list || [];
              this.appList = data.list || [];
              this.noAppList= this.appList.length==0 ? true : false;
              this.doGetAppName();
            });
        }
      },
      //搜索应用
      search(val) {
        this.appList = this.allAppList.filter((item) => {
          return (item.applicationName.indexOf(val) != -1);
        });
        this.noAppList= this.appList.length==0 ? true : false;
      },
      selectApp(appId, appName) {
        Object.assign(this.$route.query,{
            'appId': appId
          });
        if (!!appName) this.appName = appName;
        if (this.$children[0] && (typeof this.$children[0].getClusterList == 'function')){
          this.$children[0].getClusterList(this.$route.query, appName||this.appName);
        }
      },
      doGetAppName(){
        let appId = this.$route.query.appId;
        this.appName = '';

        if (!!appId && this.$route.name.indexOf('list')!=-1){
          this.appName = this.getSelectAppName(appId);
          this.selectApp(appId, this.appName);
        }
      },
      //获取选中的appName
      getSelectAppName(appId) {
        let appObj = this.appList.find((n) => n.applicationId == appId);
        return appObj ? appObj.applicationName : '';
      },
      //获取集群列表
      getClusterList(params) {
        if (!params.appId) return;
        
        getClusterList({
          productId: params.productId,
          appId: params.appId
        }).then((data) => {
          this.clusterList = data.clusters || [];
          let obj = _.findInMap(this.clusterList, 'clusterId', params.clusterId);
          this.clusterName = obj?obj.clusterName:'';
        });
      },
      //获取集群名称
      getClusterName(params) {
        this.clusterName = '';
        this.getClusterList(params);
      },
    }
  }
</script>

<style lang="less">
.text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.no-data {
  padding: 20px;
}
nav {
  width: 156px;
  height: 100%;
  border-right: 1px solid #e5e5e5;
  background: #f3f3f3;
  color: #888;
  .u-iptsearch {
    padding: 17px 20px;
  }
  ul {
    position: absolute;
    top: 62px;
    left: 0;
    bottom: 0;
    width: 156px;
    overflow-y: auto;
    margin-bottom: 0;
    li {
      height: 36px;
      line-height: 36px;
      a {
          display: block;
          padding: 0 20px;
          .text-overflow();
          color: #888;
          &:hover {
            color: #333;
          }
      }
      a.act {
          background: #e9e9e9;
          color: #333;
      }
    }
  }
}

.m-home {
  position: absolute;
  top: 0;
  left: 156px;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  padding: 43px 50px 20px;
  .tlt {
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    color: #333;
    margin-bottom: 28px;
  }
}
</style>