<template>
  <div class="m-content">
    <tabs>
      <tab header="构建服务器管理" url="/sysConfig/buildServer">
      </tab>
      <tab header="NOS存储管理" url="/sysConfig/nosStore">
      </tab>
      <tab-group header="基础件管理">
        <tab header="类型" url="/sysConfig/basicType">
        </tab>
        <tab header="基础包" url="/sysConfig/basicPackage">
        </tab>
      </tab-group>
      <tab header="模板管理" url="/sysConfig/template">
      </tab>
      <tab header="产品设置" url="/sysConfig/product">
      </tab>
      <tab header="管理员设置" url="/sysConfig/admin">
      </tab>
    </tabs>
    <router-view></router-view>
</template>
<script>
  import Tab from 'src/components/Tab.vue'
  import Tabs from 'src/components/Tabs.vue'
  import TabGroup from 'src/components/TabGroup.vue'

  export default {
    components: { Tab, Tabs, TabGroup},
    data () {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>
<style>
 
</style>
