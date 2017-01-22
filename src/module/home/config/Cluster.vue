<!-- 集群配置 -->
<template>
<div>
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a>&nbsp;>&nbsp;集群配置</p>
  <form class="m-form">
      <div class="fmitem">
          <label class="fmlab"><i>*</i>应用类型：</label>
          <div class="fmcnt">
              <select class="u-ipt" 
                      v-model="obj.appType">
                <option value="">请选择</option>
                <option value="{{ key }}" v-for="(key, val) in database.appType">{{ val }}</option>
              </select>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab">构建服务器：</label>
          <div class="fmcnt">
              <select class="u-ipt" v-model="obj.buildServerClusterId">
                <option value="">默认</option>
                <option value="{{ item.clusterId }}" v-for="item in database.buildServerCluster">{{ item.clusterName }}</option>
              </select>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab">NOS配置：</label>
          <div class="fmcnt">
              <select class="u-ipt" v-model="obj.nosConfigId">
                <option value="">默认</option>
                <option value="{{ item.id }}" v-for="item in database.nosConfig">{{ item.name }}</option>
              </select>
          </div>
      </div>
      <div class="fmitem">
        <label class="fmlab"></label>
        <div class="fmcnt u-btns">
          <input type="button" 
             name="submit" 
             class="u-btn mb10" 
             value="取消"
             @click="cancel"/>
          <input type="button" 
             name="submit" 
             class="u-btn u-btn-primary" 
             value="保存"
             @click="add"/>
        </div>
      </div>
    </form>
</div>
</template>

<script>
  import Vue from 'vue'
  import * as service from 'src/service/home/cluster'

  export default {
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        options: [],
        obj: {
            appType: '',
            buildServerClusterId: '',
            nosConfigId: '',
            clusterId: +this.$route.query.clusterId
        },
        database : {
          appType: [],
          buildServerCluster: [],
          nosConfig: []
        },
      }
    },
    ready() {
      this.getConfig();
      this.$parent.getClusterName(this.query);
    },
    methods: {
      getConfig() {

        service.get(this.clusterId)
          .then((data) => {
            let clusterConfig = data.clusterConfig || {};

            this.database = data.database || {};
            this.obj =  {
                appType: clusterConfig.appType ? clusterConfig.appType.replace(/\s/,''):'',
                buildServerClusterId: clusterConfig.buildServerClusterId||'',
                nosConfigId: clusterConfig.nosConfigId||'',
                clusterId: +this.clusterId
            };

          });
      },
      //跳转到集群页面
      go() {
        this.$router.go({path: '/home/list', query: { productId: this.query.productId, appId: this.query.appId }});
      },
      add() {
        this.obj.buildServerClusterId = this.obj.buildServerClusterId;
        this.obj.nosConfigId = this.obj.nosConfigId;

        service.update(
          this.obj
        ).then((data) => {
          Vue.$alert('设置成功', 'success');
          this.go();
        });
      },
      cancel() {
        this.go();
      }
    }
  }
</script>

<style lang="less">

</style>