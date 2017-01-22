<template>
  <common :type="'rollback'" :do-submit="onRollBack" v-ref:child></common>

  <!-- 回滚选择历史版本 -->
  <modal :show.sync="showModal" :submit="doRollBack">
    <h3 slot="header">回滚</h3>
    <div slot="body">
      <form class="m-form">
        <div class="fmitem">
            <label class="fmlab"><i>*</i>历史版本：</label>
            <div class="fmcnt">
                <select v-model="versionId">
                  <option value="">请选择</option>
                  <option value="{{ item.id }}" v-for="item in versionList">{{ item.versionId }}</option>
                </select>
            </div>
        </div>
      </form>
    </div>
  </modal>
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
        clusterId: this.$route.query.clusterId,
        showModal: false,
        versionList: [],
        versionId: ''
      }
    },
    ready() {

    },
    methods: {
      getBuildVersionList() {
        service.getBuildVersionList(this.clusterId)
          .then((data) => {
            this.versionList = data.list || [];
          });
      },
      onRollBack() {
        this.getBuildVersionList();
        this.showModal = true;
      },
      doRollBack() {
        if (!this.versionId){
          Vue.$alert('请选择回滚版本', 'danger');
          return;
        }
        if (!this.$refs.child) return;
        let list = this.$refs.child.batchList;
        list = this.$refs.child.handleContinue(list);

        service.doRollBack({
          clusterId: this.clusterId,
          batchList: list,
          strategy: this.$refs.child.obj,
          workflowType: 'deploy',
          rollBackBuildVersionId: this.versionId
        }).then((data) => {
          Vue.$alert('开始回滚', 'success');
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