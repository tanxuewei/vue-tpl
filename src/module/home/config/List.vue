<template>
  <div>
    <p class="tlt f-cb">
        <span class="f-fl">{{ appName }}</span>
        <span class="f-fr">
          <span v-if="followed" 
                class="u-btn u-btn-gray" 
                @click="follow('unfollow')">已收藏</span>
          <span v-else 
                class="u-btn u-btn-s" 
                @click="follow('follow')">收藏</span>
        </span>
    </p>
    <table class="m-table">
        <thead>
            <tr>
                <th>集群名称</th>
                <th>集群状态</th>
                <th>应用类型</th>
                <th>配置</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in clusterList">
                <td><a v-link="{path: '/home/deploy', exact: true, query: {'appId': $route.query.appId, 'productId': $route.query.productId, 'clusterId': item.clusterId}}" title="{{ item.clusterName }}">{{ item.clusterName }}</a></td>
                <td>{{ item.clusterStatus }}</td>
                <td>{{ item.appType }}</td>
                <td class="u-btns">
                  <template v-if="item.isDeployer" v-for="(index, obj) in optList">
                    <span v-if="!item.appType && index==2" class="u-btn u-btn-s1 u-btn-dis" title="请先进行集群配置">发布配置</span>
                    <span v-else class="u-btn u-btn-s1">
                      <a v-link="{path: '/home/'+ obj.link, exact: true, query: {'appId': $route.query.appId, 'productId': $route.query.productId, 'clusterId': item.clusterId}}">{{ obj.name }}</a>
                    </span>
                  </template>
                  <template v-if="!item.isDeployer">
                    <span class="u-btn u-btn-s1 u-btn-dis" v-for="obj in optList">{{ obj.name }}</span>
                  </template>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
  import { getClusterList, follow } from 'src/service/common'

  export default {
    data () {
      return {
        clusterList: [],
        appName: '',
        followed: false,
        optList: [{
          name: '集群配置',
          link: 'cluster'
        },{
          name: '构建配置',
          link: 'build'
        },{
          name: '发布配置',
          link: 'publish'
        },{
          name: '权限配置',
          link: 'auth'
        }]
      }
    },
    ready() {
      // this.getClusterList(this.$route.query, this.$parent.$data.appName);
      this.$parent.selectApp(this.$route.query.appId);
    },
    methods: {
      getClusterList(params, appName) {
        if (!params.appId) return;
        this.appName = appName;
        getClusterList(params)
          .then((data) => {
            if (!data){
              this.clusterList = [];
              return;
            }
            this.clusterList = data.clusters || [];
            this.followed = data.followed || false;
          });
      },
      follow(type) {
        Object.assign(this.$route.query,{
            'action': type
          });
        follow(this.$route.query)
          .then((data) => {
            this.followed = !this.followed;
            if (this.$route.name == 'home/list'){

              this.refreshProList();
            }
          });
      },
      //刷新收藏列表
      refreshProList() {
        let sidebar = this.$parent.$parent.$refs.sidebar;
        
        sidebar && sidebar.getFollowedList();
      }
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