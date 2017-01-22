<template>
  <div class="m-content">
    <tabs>
      <tab header="密钥管理" url="/userConfig/secretKey">
      </tab>
    </tabs>
    <router-view></router-view>
</template>
<script>
  import Tab from 'src/components/Tab.vue'
  import Tabs from 'src/components/Tabs.vue'

  export default {
    components: { Tab, Tabs },
    data () {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>
<style lang="less">
 
</style>
