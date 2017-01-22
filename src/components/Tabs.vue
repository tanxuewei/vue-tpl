<template>
  <!-- Nav tabs -->
  <ul class="nav nav-{{navStyle}}" role="tablist">
    <template v-for="t in headers">
      <li class="j-tab" v-if="!t._tabgroup" :class="{active: ($route.path == t.url), disabled:t.disabled}" @click.prevent="select(t)">
        <a v-link="{ 'path': t.url}"><slot name="header">{{{t.header}}}</slot></a>
      </li>
      <dropdown v-else :text="t.header" :class="{active:t.active}" :disabled="t.disabled">
        <li v-for="tab in t.tabs" :class="{disabled:tab.disabled}">
          <!-- <a v-link="{ 'path': tab.url}" @click.prevent="select(tab)">{{tab.header}}</a> -->
          <a v-link="{ 'path': tab.url}">{{tab.header}}</a>
        </li>
      </dropdown>
    </template>
  </ul>
  <div class="tab-content" v-el:tab-content>
    <slot></slot>
  </div>
</template>

<script>
import coerceNumber from './utils/coerceNumber.js'
import dropdown from './Dropdown.vue'
export default {
  components: {
    dropdown
  },
  props: {
    navStyle: {
      type: String,
      default: 'tabs'
    },
    effect: {
      type: String,
      default: 'fadein'
    },
    active: {
      type: Number,
      coerce: coerceNumber,
      default: 0
    }
  },
  data () {
    return {
      show: null,
      headers: [],
      tabs: []
    }
  },
  created () {
    this._tabset = true
  },
  watch: {
    active (val) {
      this.show = this.tabs[val]
    }
  },
  ready () {
    this.show = this.tabs[this.active]
  },
  methods: {
    select (tab) {
      if (!tab.disabled) {
        this.active = tab.index
      }
    }
  }
}
</script>

<style lang="less">
@base: #CE3D3A;
  .nav-tabs {
    margin-bottom: 15px;
  }
  .nav {
    li.j-tab>a {
      color: #888;
      padding: 10px 0;
      margin-right: 52px;
      border-left: none;
      border-right: none;
      border-top: none;
      &:hover {
        color: #888;
        background: #fff;
        border: none;
      }
    }
    li.active > a, li.active > a:hover, li.active > a:focus {
      color: #333;
      cursor: default;
      background-color: #fff;
      border: none;
      border-bottom: 2px solid @base;
    }
    li.dropdown>a{
      padding: 10px 0;
      margin-right: 52px;
      border: none;
      color: #888;
      &:hover, &:focus {
        background: #fff;
        // border-bottom: 2px solid @base;
      }
    }
    .dropdown-menu {
      left: -18px;
      min-width: 120px;
    }
    .open > a, .open > a:hover, .open > a:focus {
      background-color: #fff;
      // color: #333;
    }
  }
</style>