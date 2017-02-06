<template>
  <div>
    <header class="f-cb">
        <div class="m-logo">
            <a class="" href="#" v-link="'/home'">
              vue测试
            </a>
        </div>
        <ul class="m-nav f-fr">
            <li><a href="/logout"><i class="u-icon u-icon-exit"></i>退出</a></li>
        </ul>
    </header>
    <div class="g-bd">
      <div class="g-sd">
          <sidebar :time="totalTime" v-ref:sidebar></sidebar>
      </div>
      <div class="g-mn">
          <router-view v-ref:view></router-view>
      </div>
    </div>
    <!-- <footer>
      网易杭州研究院运维部
    </footer> -->
  <alert :show.sync="showTop" placement="top" duration="3000" width="400px" dismissable v-ref:alert>
    <!-- <i class="iconfont icon-tip"></i> -->
  </alert>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Alert from './components/Alert.vue'
  import Sidebar from './components/Sidebar.vue'

  export default {
    components: { Sidebar, Alert },
    ready() {
      Vue.$alert = Vue.prototype.$alert = this.$refs.alert.open.bind(this.$refs.alert);
    },
    data() {
      return {
        totalTime: 0,
        showTop: false,
      }
    },
    events: {
      timeUpdate (timeEntry) {
        this.totalTime += parseFloat(timeEntry.totalTime)
      },
      deleteTime (timeEntry) {
        this.totalTime -= parseFloat(timeEntry.totalTime)
      },
      selectProduct(id) {
        let view = this.$refs.view;
        (view && typeof view.getAppList == 'function') && view.getAppList(id);
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
@base: #CE3D3A;
header {
  border-bottom: 1px solid #ccc;
  height: 52px;
}
.m-logo {
  width: 156px;
  height: 52px;
  line-height: 52px;
  background: @base;
  font-size: 16px;
  color: #fff;
  text-align: center;
  display: inline-block;

  a {
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
}
.m-nav {
  color: #888;
  li {
    float: left;
    margin-right: 52px;
    font-size: 14px;
    line-height: 52px;
    a {
      color: #888;
    }
    a.v-link-active {
      color: #333;
    }
  }
}
/* 两列右侧自适应布局 */
.g-bd {
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .g-sd {
    position: absolute;
    top: 0;
    width: 156px;
    bottom: 0;
    background-color: #292F37;
  }
  .g-mn {
    position: absolute;
    top: 0;
    left: 156px;
    bottom: 0;
    right: 0;
    overflow: auto;
  }
}

footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>