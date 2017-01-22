<template>
<div class="m-deploy">
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a></p>
  <ul class="item-btn">
    <li class="u-btn u-btn-gray"
        @click="onBuild">构建
    </li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/do', exact: true, query: $route.query}">发布</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/all', exact: true, query: $route.query}">一键发布</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/rollback', exact: true, query: $route.query}">回滚</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/restart', exact: true, query: $route.query}">重启</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/stop', exact: true, query: $route.query}">停止</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/online', exact: true, query: $route.query}">上线</a></li>
    <li><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/offline', exact: true, query: $route.query}">下线</a></li>
  </ul>
  <form class="m-form m-form-2">
      <div class="fmitem">
          <label class="fmlab">构建状态：</label>
          <div class="fmcnt f-cb">
              <spin v-if="curBuildStatus == 'ongoing'"></spin>
              <span class="b-name">{{ buildStatusMap[curBuildStatus] }}</span>
              <span v-if="curBuildStatus == 'error'" 
                    class="u-btn u-btn-small ml30"
                    @click="restartBuild">重新构建</span>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab">最新版本：</label>
          <div class="fmcnt">
              {{ buildMap.currentVersion || '暂无版本' }}
              <span v-if="buildMap.currentVersion" 
                    class="u-btn u-btn-small ml30"
                    @click="showLog">查看日志</span>
          </div>
      </div>
      <div class="fmitem row">
          <label class="fmlab">发布状态：</label>
          <div class="fmcnt">
            <Steps :current="curBatchId" size="small" :status="deployStatus" v-if="deployStatus">
                <Step v-for="(index, item) in batchGroupList" :title="'组'+(index+1)" :id="item.actionBatchId" :on-step="onStep"></Step>
            </Steps>
            <p v-else>不在发布中</p>
          </div>
      </div>
  </form>
  <div class="m-tab-2">
    <tabs :active="tab">
      <tab header="实例列表">
        <table class="m-table">
            <thead>
                <tr>
                    <th>主机</th>
                    <th>实例</th>
                    <th>源模板</th>
                    <th>目标模板</th>
                    <th>发布状态</th>
                    <th>权限</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="item in instanceList">
                  <td title="{{ item.hostName }}">{{ item.hostName }}</td>
                  <td title="{{ item.instanceName }}">{{ item.instanceName }}</td>
                  <td title="{{ item.sourceTemplateName }}">{{ item.sourceTemplateName }}</td>
                  <td title="{{ item.targetTemplateName }}">{{ item.targetTemplateName }}</td>
                  <td title="{{ item.status || item.deployStatus }}">{{ item.status || deployStatus }}</td>
                  <td class="u-btns">
                      <span class="u-btn u-btn-s1" 
                         @click="onDeployLog(item.batchInstanceId)" 
                         title="发布日志">发布日志</span>
                      <span class="u-btn u-btn-s1" 
                          @click="onAppLog(item.batchInstanceId)" 
                          title="应用日志" 
                          style="margin-left: 5px;">应用日志</span>
                  </td>
              </tr>
            </tbody>
        </table>
      </tab>
      <tab header="显示日志">
        <!-- <div class="m-log" v-if="curBuildStatus=='ongoing'"> -->
        <div class="m-log">
          <ul v-el:log>
            <li v-for="(index, item) in logList" track-by="$index">{{ item }}</li>
          </ul>
        </div>
        <!-- <p v-else>暂无日志</p> -->
      </tab>
    </tabs>
  </div>
</div>
<modal :show.sync="showModal" :submit="doSubmit" :modalclazz="'modal-large'" :bottom-bar="false">
    <h3 slot="header">构建</h3>
    <div slot="body">
      
    </div>
</modal>
</template>

<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import spin from 'src/components/Spin.vue'
  import steps from 'src/components/Steps.vue'
  import step from 'src/components/Step.vue'
  import grid from 'src/components/Grid.vue'
  import Tab from 'src/components/Tab.vue'
  import Tabs from 'src/components/Tabs.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/home/deploy'

  export default {
    components: { modal, spin, steps, step, grid, Tab, Tabs },
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        typeList: [{
                    name: '组一',
                    descp: '',
                    status: 'ok'
                },{
                    name: 'xxx.hz.netease.com',
                    descp: 'default',
                    status: 'ok'
                },{
                    name: 'xxx.hz.netease.com',
                    descp: 'default',
                    status: 'ok'
                },{
                    name: 'xxx.hz.netease.com',
                    descp: 'default',
                    status: 'ok'
                },{
                    name: 'xxx.hz.netease.com',
                    descp: 'default',
                    status: 'ok'
                }],
        showModal: false,
        buildStatusMap: { 'no': '无状态', 'pending': '等待中', 'ongoing': '构建中', 'error': '构建失败', 'finish': '构建成功'},
        //构建状态
        buildMap: {
          status: "",
          currentVersion: '',
          buildTaskId: 0,
          progress: 0,
          workflowId: 0
        },
        lineNumber: 0,
        logList: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0],
        curBatchId: 0,
        batchGroupList: [],
        instanceList: [],
        curBatch: {},
        curBatchId: 0,
        deployStatus: 'ongoing',
        tab: 1,
      }
    },
    computed: {
      curBuildStatus() {
        return this.buildMap.status || 'no';
      },
    },
    watch: {
      'curBuildStatus': function(val){
        if (val == 'ongoing'){
          this.refreshBuildStatus();
        }else{
          clearInterval(this.buildStatusTimer);
          this.buildStatusTimer = null;
        }
      }
    },
    ready() {
      this.$parent.getClusterName(this.query);
      this.getBuildStatus();
      this.getDeployStatus();
    },
    methods: {
      getBuildStatus() {
        let self = this;
        service.getBuildStatus({
          clusterId: this.clusterId
        }).then((data) => {
          this.buildMap = data || {};
          if (data.status == 'ongoing') {
            self.getDeployLog();
            self.tab = 1;
          } else{
            self.tab = 0;
          }
        });
      },
      refreshBuildStatus() {
        this.buildStatusTimer = setInterval(this.getBuildStatus, 5000);
      },
      onBuild() {
        service.startBuild({
          clusterId: this.clusterId
        }).then((data) => {
          this.getBuildStatus();
        });
      },
      restartBuild() {
        service.restartBuild({
          clusterId: this.clusterId
        }).then((data) => {
          this.buildMap = data || {};
          if (data.status == 'ongoing') {
            self.getDeployLog();
            self.tab = 1;
          }else{
            self.tab = 0;
          } 
        });
      },
      getDeployLog() {
        let self = this;
        service.getBuildLog({
          buildTaskId: this.buildMap.buildTaskId,
          lineNumber: this.lineNumber
        }).then((data) => {
          if (data.isFinish){
            clearInterval(this.logTimer);
            this.logTimer = null;
          }else{
            this.lineNumber += Number(data.total) || 0;
            this.logList = this.logList.concat(data.list || []);
            //滚到最底部
            this.$els.log.scrollTop = 99999;
            if (data.total == 0){
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.logTimer = setInterval(function(){
                self.getDeployLog();
              }, 5000);
            }else{
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.getDeployLog();
            }
          }
        });
      },
      getDeployStatus() {
        let self = this;
        service.getDeployStatus({
          clusterId: this.clusterId
        }).then((data) => {
          self.batchGroupList = data.batchGroupList || [];
          self.deployStatus = data.status;

          if (!!data.status){
            self.curBatch = _.findInMap(data.batchGroupList, 'status', 'ongoing') || data.batchGroupList[data.batchGroupList.length-1] || {};
            self.curBatchId = self.curBatch.actionBatchId || 0;
            self.instanceList = self.curBatch.instanceList || [];
          }else{
            self.instanceList = self.batchGroupList[0]?self.batchGroupList[0].instanceList:[];
          }
        });
      },
      getDeployGroupStatus(num) {
        service.getDeployGroupStatus({
          batchIds: num
        }).then((data) => {

        });
      },
      showLog() {
        
      },
      //发布日志
      onDeployLog() {

      },
      //应用日志
      onAppLog() {

      },
      //切换步骤
      onStep(num) {
        console.log(num);
        //获取选择组状态以及实例列表
        let selBatch = _.findInMap(this.batchGroupList, 'actionBatchId', num);
        this.instanceList = selBatch ? selBatch.instanceList : [];
        this.getDeployGroupStatus(num);
      }
    }
  }
</script>

<style lang="less">
.m-deploy {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 43px 50px 20px;
  .item-btn {
    overflow: hidden;
    height: 32px;
    li {
      float: left;
      margin-right: 10px;
      &:last-child {
        margin: 0;
      }
    }
  }
  .ivu-spin {
    float: left;
  }
  .b-name {
    margin-left: 10px;
    float: left;
  }
}

.m-tab-2 {
  position: relative;
  height: calc(~"100% - 165px");
  .tab-content {
    position: absolute;
    top: 55px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-x: hidden;
    /*overflow-y: auto;*/
  }
}

.m-log {
  background: #f5f5f5;
  ul {
    padding: 10px 20px;
    height: 100%;
    overflow: auto;
    li {
      line-height: 20px;
      word-wrap: break-word;
      word-break: break-all;
      word-spacing: normal;
    }
  }
}
</style>