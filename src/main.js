import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
// import VueDragableFor from 'vuedragablefor'
import Filter from './base/filter.js'
import Directive from './base/directive.js'

import App from './App.vue'

//首页
import Home from './module/index.vue'

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
    name: 'home',
    component: Home
  }
})

router.locals = window.__locals__ || {};

router.redirect({
  '*': '/home'
})

router.start(App, '#app')