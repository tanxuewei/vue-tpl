<template>
<div class="m-deploy">
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a></p>
  <ul v-if="auth" class="item-btn">
    <li class="u-btn u-btn-gray disabled"
        v-if="curBuildStatus == 'error' || curBuildStatus == 'ongoing'">构建
    </li>
    <li class="u-btn u-btn-gray"
        v-else
        @click="onBuild">构建
    </li>
    <template v-for="(index, item) in optList">
      <li v-if="index!=0"><a class="u-btn u-btn-gray" v-link="{path: '/home/deploy/'+ item.link, exact: true, query: $route.query}">{{ item.name }}</a></li>
    </template>
  </ul>
  <ul v-else class="item-btn">
    <li class="u-btn u-btn-gray disabled" v-for="item in optList">{{ item.name }}</li>
  </ul>
  <form class="m-form m-form-2">
      <div class="fmitem">
          <label class="fmlab">构建状态：</label>
          <div class="fmcnt f-cb">
              <spin v-if="curBuildStatus == 'ongoing'"></spin>
              <span class="b-name">{{ buildStatusMap[curBuildStatus] }}</span>
              <tooltip effect="scale" placement="top" :content="errorMsg" v-if="curBuildStatus == 'error'">
                  <span v-if="curBuildStatus == 'error'" 
                    class="iconfont icon-tip ml10"></span>
              </tooltip>
              <span v-if="curBuildStatus == 'error'" 
                    class="u-btn u-btn-small ml30"
                    @click="restartBuild">重新构建</span>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab">最新版本：</label>
          <div class="fmcnt">
              {{ buildMap.currentVersion || '暂无版本' }}
              <span v-if="buildMap.buildTaskId" 
                    class="u-btn u-btn-small ml30"
                    @click="getBuildTaskLog">查看日志</span>
          </div>
      </div>
      <div class="fmitem row">
          <label class="fmlab">发布状态：</label>
          <div class="fmcnt">
            <Steps :current="curBatchId" size="small" :status="deployStatus" v-if="deployStatus" v-ref:steps>
                <Step v-for="(index, item) in batchGroupList" 
                      :title="'组'+(index+1)+(item.actionBatchId==selBatchId?'(选中)':'')" 
                      :id="item.actionBatchId" 
                      :status="item.status"
                      :on-step="onStep"></Step>
            </Steps>
            <p v-else style="margin-top: -5px;">不在发布中</p>
            <span class="u-btn u-btn-primary u-btn-small" @click="next" v-if="showNext">继续</span>
          </div>
      </div>
  </form>
  <table class="m-table">
      <thead>
          <tr>
              <th>主机</th>
              <th>实例</th>
              <th>当前模板</th>
              <template v-if="deployStatus">
                <th>目标模板</th>
                <th>发布状态</th>
                <th>操作</th>
              </template>
              <template v-else>
                <th>上次发布时间</th>
                <th>上次发布状态</th>
              </template>
          </tr>
      </thead>
      <tbody>
        <tr v-for="item in instanceList">
            <td title="{{ item.hostName }}">{{ item.hostName }}</td>
            <td title="{{ item.instanceName }}">{{ item.instanceName }}</td>
            <td title="{{ item.sourceTemplateName }}">{{ item.sourceTemplateName }}</td>
            <template v-if="deployStatus">
              <td title="{{ item.targetTemplateName }}">{{ item.targetTemplateName }}</td>
              <td title="{{ item.deployStatus }}">
                <spin v-if="item.deployStatus == 'ongoing'"></spin>
                <i v-if="item.deployStatus == 'finish'" class="iconfont icon-success"></i>
                <i v-if="item.deployStatus == 'pending'" class="iconfont icon-wait"></i>
                <i v-if="item.deployStatus == 'error'" class="iconfont icon-error"></i>
              </td>
              <td class="u-btns">
                  <span class="u-btn u-btn-s1" 
                     @click="onDeployLog(item.batchInstanceId)" 
                     v-if="item.deployStatus != 'pending'"
                     title="发布日志">发布日志</span>
                  <!-- <span class="u-btn u-btn-s1" 
                      @click="onAppLog(item.batchInstanceId)" 
                      title="应用日志" 
                      style="margin-left: 5px;">应用日志</span> -->
                  <span class="u-btn u-btn-s1" 
                      v-if="(selBatchStatus == 'ongoing' || selBatchStatus == 'error') && item.deployStatus == 'error'"
                      @click="doRetry(item.batchInstanceId)" 
                      title="重试" 
                      style="margin-left: 5px;">重试</span>
                  <span class="u-btn u-btn-s1" 
                      v-if="(selBatchStatus == 'ongoing' || selBatchStatus == 'error') && item.deployStatus == 'error'"
                      @click="doIgnore(item.batchInstanceId)" 
                      title="忽略" 
                      style="margin-left: 5px;">忽略</span>
              </td>
            </template>
            <template v-else>
              <td title="{{ item.lastDeployTime | moment 'YYYY-MM-DD HH:mm:ss' }}">{{ item.lastDeployTime | moment "YYYY-MM-DD HH:mm:ss" }}</td>
              <td title="{{ item.lastDeployStatus }}">
                  <span v-if="item.lastDeployStatus == 'error'" 
                        class="iconfont icon-error"
                        @click="showInstaceErrorMsg(item.lastErrorReason)"></span>
                  <i v-if="item.lastDeployStatus == 'finish'" class="iconfont icon-success"></i>
                  <i v-if="item.lastDeployStatus == 'pending'" class="iconfont icon-wait"></i>
              </td>
            </template>
        </tr>
      </tbody>
  </table>
</div>
<modal :show.sync="showModal" :bottom-bar="false">
    <h3 slot="header">错误信息</h3>
    <div slot="body">
      {{ instanceErrorMsg }}
    </div>
</modal>
<!-- 显示日志 -->
<div class="m-log" v-if="showLog">
  <i class="iconfont icon-del-2" @click="closeLog"></i>
  <!-- 构建日志 -->
  <ul v-el:log
      v-if="curBuildStatus=='ongoing'"
      class="log">
    <li v-for="(index, item) in logList" track-by="$index">{{ item }}</li>
  </ul>
  <!-- 查看日志 -->
  <div v-el:log
       v-else
       class="log">
    {{{ logs }}}
  </div>
</div>
</template>

<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import spin from 'src/components/Spin.vue'
  import steps from 'src/components/Steps.vue'
  import step from 'src/components/Step.vue'
  import grid from 'src/components/Grid.vue'
  import tooltip from 'src/components/Tooltip.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/home/deploy'

  export default {
    components: { modal, spin, steps, step, grid, tooltip },
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        optList: [{
          name: '构建',
          link: 'build'
        },{
          name: '发布',
          link: 'do'
        },{
          name: '一键发布',
          link: 'all'
        },{
          name: '回滚',
          link: 'rollback'
        },{
          name: '重启',
          link: 'restart'
        },{
          name: '停止',
          link: 'stop'
        },{
          name: '上线',
          link: 'online'
        },{
          name: '下线',
          link: 'offline'
        }], 
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
        auth: true,
        buildStatusMap: { 'no': '无状态', 'pending': '等待中', 'ongoing': '构建中', 'error': '构建失败', 'finish': '构建成功'},
        //构建状态
        buildMap: {
          status: 'no',
          currentVersion: '',
          buildTaskId: 0,
          progress: 0,
          workflowId: 0,
          errorMsg: ''
        },
        errorMsg: '',
        showLog: false,
        logs: '',

        lineNumber: 0,
        logList: [],
        batchGroupList: [],
        instanceList: [],
        curBatch: {},
        curBatchId: -1,
        selBatchId: 0,
        deployStatus: 'ongoing',
        showNext: '',
        selBatchStatus: '',
        //发布日志相关
        offset: 0,
        isDeploy: false,
        instanceErrorMsg: ''
      }
    },
    route: {
      deactivate: function(transition){
        clearInterval(this.buildStatusTimer);
        clearInterval(this.logTimer);
        clearInterval(this.groupStatusTimer);
        clearInterval(this.instanceStatusTimer);
        transition.next();
      }
    },
    computed: {
      curBuildStatus() {
        return this.buildMap.status || 'no';
      },
      logLength() {
        return this.logList.length;
      }
    },
    watch: {
      'curBuildStatus': function(val){
        switch(val) {
          case 'ongoing': 
            this.showLog = true;
            this.getBuildLog();
          break;
          case 'finish':
            this.lineNumber = 0;
            this.showLog = false;
            clearInterval(this.buildStatusTimer);
            this.buildStatusTimer = null;

            if (this.deployStatus == 'pending'){
              this.getDeployStatus();
            }
          break;
          default:
            clearInterval(this.buildStatusTimer);
            this.buildStatusTimer = null;
          break;
        }
      },
      'deployStatus': function(val){
        switch(val) {
          case 'pending':
          break;
          case 'ongoing': 
          break;
          default:
          break;
        }
      },
      'logLength': function(val){
        this.$els.log && (this.$els.log.scrollTop = 99999999);
      }
    },
    ready() {
      this.$parent.getClusterName(this.query);
      this.getBuildStatus();
      this.getDeployStatus('init');
    },
    methods: {
      //获取构建状态
      getBuildStatus() {
        let self = this;
        service.getBuildStatus({
          clusterId: this.clusterId
        }).then((data) => {
          //没有权限
          if (!data){
            this.auth = false;
          }
          this.buildMap = data || {};
          this.errorMsg = this.buildMap.errorMsg || '无错误信息';
        });
      },
      //构建状态为ongoing时，每隔10s刷新一次状态
      refreshBuildStatus() {
        this.buildStatusTimer = setInterval(this.getBuildStatus, 10000);
      },
      //点击构建日志
      onBuild() {
        service.startBuild({
          clusterId: this.clusterId
        }).then((data) => {
          this.getBuildStatus();
        });
      },
      //重新构建
      restartBuild() {
        service.restartBuild({
          clusterId: this.clusterId
        }).then((data) => {
          // this.getBuildLog();
          this.getBuildStatus();
        });
      },
      //获取构建日志
      getBuildLog() {
        let self = this;
        service.getBuildLog({
          buildTaskId: this.buildMap.buildTaskId,
          lineNumber: this.lineNumber
        }).then((data) => {
          this.logList = this.logList.concat(data.list || []);
          this.$els.log && (this.$els.log.scrollTop = 99999999);
          if (!!data.isFinish){
            // this.getDeployStatus();
            //构建日志完成时，刷新构建状态
            this.getBuildStatus();

            clearInterval(this.logTimer);
            this.logTimer = null;
          }else{
            this.lineNumber += Number(data.total) || 0;
            //滚到最底部
            if (data.total == 0){
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.logTimer = setInterval(function(){
                self.getBuildLog();
              }, 5000);
            }else{
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.getBuildLog();
            }
          }
        });
      },
      getDeployStatus(type) {
        let self = this;

        service.getDeployStatus({
          clusterId: this.clusterId
        }).then((data) => {
          if (!data){
            this.deployStatus = null;
            return;
          }
          //只有初始化的时候渲染批次
          if (type){
            self.batchGroupList = data.batchGroupList || [];
          }

          self.deployStatus = data.status;

          if (!!data.status){
            if (data.status == 'pending'){
              self.curBatch = data.batchGroupList?data.batchGroupList[0]:{};
              self.curBatchId = 0;
              self.selBatchStatus = self.curBatch.status;
              self.instanceList = self.curBatch.instanceList || [];
              clearInterval(self.groupStatusTimer);
            }else{

              let showGoing = _.findInMap(data.batchGroupList, 'status', 'ongoing');
              self.showNext = _.findInMap(data.batchGroupList, 'showContinueButton', true);
              self.curBatch = showGoing || self.showNext || data.batchGroupList[data.batchGroupList.length-1] || {};
              self.curBatchId = self.curBatch.actionBatchId || 0;
              self.selBatchStatus = self.curBatch.status;
              self.instanceList = self.curBatch.instanceList || [];
              clearInterval(self.groupStatusTimer);

              if (showGoing){
                
                self.groupStatusTimer = setInterval(function(){self.getDeployGroupStatus(self.curBatchId)}, 10000);
                self.getDeployGroupStatus(self.curBatchId);
              }

              if (self.showNext){
                console.log(self.showNext);
                //显示继续两个字
              }
            }
            
          }else{ //不在发布中
            self.batchGroupList = data.batchGroupList || [];
            self.instanceList = self.batchGroupList[0]?self.batchGroupList[0].instanceList:[];
          }
        });
      },
      getDeployGroupStatus(num, type) {
        let self = this;
        if (!num) return;

        service.getDeployGroupStatus({
          batchIds: num
        }).then((data) => {
          let obj = data[num];
          if (obj.status == 'ongoing'){
            clearInterval(this.instanceStatusTimer);
            self.getInstanceStatus(num);
            this.instanceStatusTimer = setInterval(function(){self.getInstanceStatus(num)}, 20000);

          }else if(obj.status == 'finish'){
            clearInterval(this.groupStatusTimer);
            clearInterval(this.instanceStatusTimer);
            
            if (type != 'sel'){
              
              this.getDeployStatus();
            }
            // if (obj.unfinishedCount > 0){

            //   this.curBatchId = this.curBatchId + 1;
            //   self.selBatchStatus = 'ongoing';
            //   self.instanceList = self.curBatch.instanceList || [];
            // }
          }
        });
      },
      getInstanceStatus(num) {
        let instanceIdList = _.findIdList(this.instanceList, 'batchInstanceId');
        if (instanceIdList.length==0) return;

        service.getInstanceStatus({
          batchId: num,
          instanceIds: instanceIdList.join(',')
        }).then((data) => {
          for (let key in data){
            for (let i=0,len=this.instanceList.length; i<len; i++){
              let item = this.instanceList[i];
              (key == item.batchInstanceId) && (item.deployStatus = data[key].status);
            }
          }
        });
      },
      //查看构建日志
      getBuildTaskLog() {
        if (!this.buildMap.buildTaskId) return;

        service.getBuildTaskLog({
          buildTaskId: this.buildMap.buildTaskId
        }).then((data) => {
          this.showLog = true;
          let log = data.log ? data.log.replace(/\n/g,'<br/>') : '';
          this.logs = log || '<span class="f-red">没有日志</span>';
        });
      },
      //关闭日志
      closeLog() {
        this.showLog = false;
        this.logList = [];
        this.logs = ''
      },
      //点击发布日志
      onDeployLog(id) {
        if (!id) return;
        this.showLog = true;
        this.isDeploy = true;
        this.logs = '';
        clearInterval(this.logTimer);

        this.getDeployLog(id, 0);
      },
      //查看发布日志
      getDeployLog(id, end) {
        let self = this;

        service.getDeployLog({
          instanceId: id,
          offset: end
        }).then((data) => {
          let log = data.content ? data.content.replace(/\n/g,'<br/>') : '';
          this.logs = this.logs + log;
          this.$els.log && (this.$els.log.scrollTop = 99999999);
          if (!!data.hasFinished && (data.content && data.content.indexOf('get log failed') == -1)){
            clearInterval(this.logTimer);
            this.logTimer = null;
          }else{
            //滚到最底部
            if (data.end == 0){
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.logTimer = setInterval(function(){
                self.getDeployLog(id,0);
              }, 5000);
            }else{
              clearInterval(this.logTimer);
              this.logTimer = null;
              this.getDeployLog(id, data.end);
            }
          }
        });
      },
      //应用日志
      onAppLog(id) {

      },
      doRetry(id) {
        service.retryInstance({
          clusterId: this.clusterId,
          instanceId: id
        }).then((data) => {
          Vue.$alert('重试成功', 'success');
          this.getDeployStatus();
        });
      },
      doIgnore(id) {
        let self = this;
        service.ignoreInstance({
          instanceId: id
        }).then((data) => {
          Vue.$alert('忽略成功', 'success');
          self.getDeployStatus();
        });
      },
      //切换步骤
      onStep(num) {
        this.selBatchId = num;
        //获取选择组状态以及实例列表
        let selBatch = _.findInMap(this.batchGroupList, 'actionBatchId', num);
        this.instanceList = selBatch ? selBatch.instanceList : [];
        this.selBatchStatus = selBatch ? selBatch.status : 'finish';
        this.getDeployGroupStatus(num, 'sel');
      },
      //点击继续时
      next() {
        service.groupContinue({
          sourceBatchId: this.curBatchId,
          targetBatchId: this.curBatchId+1
        }).then((data) => {
          this.getDeployStatus();
        });
      },
      //显示实例错误信息
      showInstaceErrorMsg(msg) {
        this.showModal = true;
        this.instanceErrorMsg = msg;
      }
    }
  }
</script>

<style lang="less">
.m-deploy {
  .item-btn {
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
    margin-right: 10px;
  }
  .b-name {
    float: left;
  }
}

.m-log {
  padding: 10px 0;
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 30%;
  right: 1%;
  width: 69%;
  height: 220px;
  border-radius: 10px;
  background-color: #002833;
  transition: opacity .3s ease;
  .log {
    padding: 0 20px;
    height: 100%;
    overflow: auto;
    line-height: 25px;
    color: #fff;
    margin-right: 2px;
    li {
      line-height: 25px;
      color: #fff;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
  i {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    font-size: 14px;
    color:  #fff;
    &:hover {
      color: #fff;
    }
  }
}
</style>