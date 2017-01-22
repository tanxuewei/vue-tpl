import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
// import VueDragableFor from 'vuedragablefor'
import Filter from './base/filter.js'
import Directive from './base/directive.js'

import App from './App.vue'

//首页
import Home from './module/home/Index.vue'
import List from './module/home/config/List.vue'
import Cluster from './module/home/config/Cluster.vue'
import Build from './module/home/config/Build.vue'
import Publish from './module/home/config/Publish.vue'
import Auth from './module/home/config/Auth.vue'

//发布主页面
import DeployBuild from './module/home/deploy/Build.vue'
import DoDeploy from './module/home/deploy/Deploy.vue'
import BuildAndDeploy from './module/home/deploy/BuildAndDeploy.vue'
import RollBack from './module/home/deploy/RollBack.vue'
import Restart from './module/home/deploy/Restart.vue'
import Stop from './module/home/deploy/Stop.vue'
import Online from './module/home/deploy/Online.vue'
import Offline from './module/home/deploy/Offline.vue'

//系统配置
import SysConfig from './module/sysConfig/index.vue'
import BuildServerManage from './module/sysConfig/buildServerManage.vue'
import NosStoreManage from './module/sysConfig/nosStoreManage.vue'
import BasicType from './module/sysConfig/basicType.vue'
import BasicPackage from './module/sysConfig/basicPackage.vue'
import TemplateManage from './module/sysConfig/templateManage.vue'
import ProductSetting from './module/sysConfig/productSetting.vue'
import Admin from './module/sysConfig/admin.vue'

//个人配置
import UserConfig from './module/userConfig/index.vue'
import SecretKey from './module/userConfig/secretKey.vue'

// import VueResource from 'vue-resource'
// import 'bootstrap/dist/css/bootstrap.css'

Vue.config.devtools = true;
Vue.config.debug = true;

// Vue.use(VueResource)
Vue.use(VueRouter);
Vue.filter(Filter);
Vue.directive(Directive);
Vue.use(VueValidator);
Vue.use(require('vue-moment'));
// Vue.use(VueDragableFor);

const router = new VueRouter()

router.map({
  '/home': {
    name: 'home/list',
    component: Home,
    subRoutes: {
      '/list': {
        name: 'home/list',
        component: List
      },
      '/cluster': {
        component: Cluster
      },
      '/build': {
        component: Build
      },
      '/publish': {
        component: Publish
      },
      '/auth': {
        component: Auth
      },
      '/deploy': {
        component: DeployBuild
      },
      '/deploy/do': {
        component: DoDeploy
      },
      '/deploy/all': {
        component: BuildAndDeploy
      },
      '/deploy/rollback': {
        component: RollBack
      },
      '/deploy/restart': {
        component: Restart
      },
      '/deploy/stop': {
        component: Stop
      },
      '/deploy/online': {
        component: Online
      },
      '/deploy/offline': {
        component: Offline
      },
    }
  },
  '/follow': {
    name: 'follow/list',
    component: Home,
    subRoutes: {
      '/list': {
        name: 'follow/list',
        component: List
      },
      '/cluster': {
        component: Cluster
      },
      '/build': {
        component: Build
      },
      '/publish': {
        component: Publish
      },
      '/auth': {
        component: Auth
      },
      '/deploy': {
        component: DeployBuild
      },
      '/deploy/do': {
        component: DoDeploy
      },
      '/deploy/all': {
        component: BuildAndDeploy
      },
      '/deploy/rollback': {
        component: RollBack
      },
      '/deploy/restart': {
        component: Restart
      },
      '/deploy/stop': {
        component: Stop
      },
      '/deploy/online': {
        component: Online
      },
      '/deploy/offline': {
        component: Offline
      }
    }
  },
  '/sysConfig': {
    component: SysConfig,
    subRoutes: {
      '/buildServer': {
        component: BuildServerManage
      },
      '/nosStore': {
        component: NosStoreManage
      },
      '/basicType': {
        component: BasicType
      },
      '/basicPackage': {
        component: BasicPackage
      },
      '/template': {
        component: TemplateManage
      },
      '/product': {
        component: ProductSetting
      },
      '/admin': {
        component: Admin
      }
    }
  },
  '/userConfig': {
    component: UserConfig,
    subRoutes: {
      '/secretKey': {
        component: SecretKey
      }
    }
  }
})

router.locals = window.__locals__ || {};

router.redirect({
  '*': '/home'
})

router.start(App, '#app')