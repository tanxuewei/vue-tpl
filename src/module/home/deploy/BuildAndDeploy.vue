<template>
  <common :type="'buildAndDeploy'" :do-submit="doBuildAndDeploy" v-ref:child></common>
</template>

<script>
  import Vue from 'vue'
  import Common from './Common.vue'
  import modal from 'src/components/Modal.vue'
  import * as service from 'src/service/home/deployBuild'

  export default {
    components: { modal, Common },
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId
      }
    },
    ready() {
    },
    methods: {
      doBuildAndDeploy() {
        if (!this.$refs.child) return;
        let list = this.$refs.child.batchList;
        list = this.$refs.child.handleContinue(list);

        service.doBuildAndDeploy({
          clusterId: this.clusterId,
          batchList: list,
          strategy: this.$refs.child.obj,
          workflowType: 'buildAndDeploy'
        }).then((data) => {
          Vue.$alert('开始一键发布', 'success');
          this.go();
        });
      },
      //跳转到集群页面
      go() {
        this.$router.go({path: '/home/deploy', query: this.query});
      },
    }
  }
</script>

<style lang="less" scoped>
</style>