<template>
<div>
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a>&nbsp;&gt;&nbsp;{{ typeMap[type] }}</p>
  <h3>分组配置</h3>
  <form class="m-form">
    <div class="fmitem" v-if="showType">
        <label class="fmlab">现有配置列表：</label>
        <div class="fmcnt">
            <select v-model="planId" @change="changePlan(planId)">
              <option value="">当前配置</option>
              <option value="{{ item.id }}" v-for="item in deployPlanList">{{ item.planName }}</option>
            </select>
        </div>
    </div>
    <div class="fmitem">
        <label class="fmlab"><i>*</i>批次：</label>
        <div class="fmcnt">
            <input type="text" 
                   name="" 
                   class="u-ipt"
                   v-model="obj.numOfBatch"/>
        </div>
    </div>
    <div class="fmitem">
        <label class="fmlab">多实例分开发布：</label>
        <div class="fmcnt">
            <input type="checkbox"
                   name="instanceInDiffBatch"
                   v-model="obj.instanceInDiffBatch">是
        </div>
    </div>
    <div class="fmitem">
        <label class="fmlab">实例分布策略：</label>
        <div class="fmcnt">
            <input type="radio" 
                   name="strategy" 
                   value="oneInFirstBatch"
                   v-model="obj.instanceDivisionType"/>第一组一个，其他均分
            <input type="radio" 
                   name="strategy" 
                   value="allDivision"
                   v-model="obj.instanceDivisionType"/>全部均分
        </div>
    </div>
    <div class="fmitem">
        <label class="fmlab">暂停策略：</label>
        <div class="fmcnt">
            <input type="radio" 
                   name="pauseType" 
                   value="pauseEachBatch"
                   v-model="obj.pauseType"/>每组暂停
            <input type="radio" 
                   name="pauseType" 
                   value="pauseOnlyFirstBatch"
                   v-model="obj.pauseType"/>第一组暂停
        </div>
    </div>
    <div class="fmitem" v-if="obj.mulTemplates.length!=0">
        <label class="fmlab">实例模板：</label>
        <div class="fmcnt">
            <div class="fmitem" v-for="item in obj.mulTemplates">
                <label class="fmlab">{{ item.instanceName }}：</label>
                <div class="fmcnt">
                    <input type="radio" 
                           name="template" 
                           value="{{ item.sourceTemplateId }}"
                           v-model="item.destTemplateId"/>{{ item.sourceTemplateName }}
                    <input type="radio" 
                           name="template" 
                           value="{{ item.replaceTemplateId }}"
                           v-model="item.destTemplateId"/>{{ item.replaceTemplateName }}
                </div>
            </div>
        </div>
    </div>
    <div class="fmitem">
        <label class="fmlab"></label>
        <div class="fmcnt">
            <span class="u-btn u-btn-primary"
                  @click="doBatch">分配</span>
        </div>
    </div>
  </form>
  <div class="f-cb" v-if="batchList.length!=0">
      <h3>分组情况</h3>
      <div class="m-group f-cb">
          <div class="gr-left f-fl">
              <div class="item" v-for="(index, item) in batchList">
                <p>组{{ index+1 }}：<input type="checkbox" name="" class="ml30" value="item.continueIfSuccess" v-model="item.continueIfSuccess">完成后暂停</p>
                <div class="item-table">
                    <table class="m-table">
                      <thead>
                        <tr>
                          <th>服务器</th>
                          <th>实例</th>
                          <th>当前模板</th>
                          <th>目标模板</th>
                        </tr>
                      </thead>
                      <tbody @dragstart="onDragStart($event)" @dragend="onDragEnd($event)" @dragover="onDragOver($event)" id="{{ index }}">
                        <tr v-for="instance in item.instanceList" draggable="true" id="{{ instance.type }}">
                          <td>{{ instance.serverName }}</td>
                          <td>{{ instance.instanceName }}</td>
                          <td>{{ instance.currentTemplate?instance.currentTemplate.name:'' }}</td>
                          <td>{{ instance.destTemplate?instance.destTemplate.name:'' }}</td>
                        </tr>
                        <tr draggable="true" v-if="item.instanceList.length==0">
                          <td>无数据</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </div>
          </div>
          <div class="gr-right f-fr">
              <h3>不发布组</h3>
              <div class="item-table">
                  <table class="m-table">
                    <thead>
                      <tr>
                        <th>服务器</th>
                        <th>实例</th>
                        <th>当前模板</th>
                        <th>目标模板</th>
                      </tr>
                    </thead>
                    <tbody @dragstart="onDragStart($event)" @dragend="onDragEnd($event)" @dragover="onDragOver($event)">
                        <tr v-for="instance in excludeServerList" draggable="true" id="{{ instance.type }}">
                          <td>{{ instance.serverName }}</td>
                          <td>{{ instance.instanceName }}</td>
                          <td>{{ instance.currentTemplate?instance.currentTemplate.name:'' }}</td>
                          <td>{{ instance.destTemplate?instance.destTemplate.name:'' }}</td>
                        </tr>
                        <tr draggable="true" v-if="excludeServerList.length==0">
                          <td>无数据</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                    </tbody>
                  </table>
              </div>
          </div>
      </div>
      <div class="ft">
        <span class="u-btn"
              @click="doCancel">取消</span>
        <span class="u-btn u-btn-primary ml30"
              @click="doSubmit">{{ typeMap[type] }}</span>
        <span class="u-btn u-btn-primary ml30"
              v-if="showType"
              @click="onAddPlan">保存配置</span>
      </div>
  </div>
</div>
<!-- 添加发布计划 -->
  <modal :show.sync="showModal" :bottom-bar="false">
    <h3 slot="header">添加发布计划</h3>
    <div slot="body">
      <table class="m-table">
        <thead>
          <tr>
            <th>配置名</th>
            <th>是否默认</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in deployPlanList">
            <td v-if="item.id">{{ item.planName }}</td>
            <td v-else><input type="text" class="u-ipt u-ipt-auto" value="{{ curPlanName }}" v-model="curPlanName" placeholder="请输入发布名称" /></td>
            <td v-if="item.id"><input type="radio" checked="{{ !!item.default }}" name="default"/></td>
            <td v-else><input type="radio" checked="{{ !!curDefault }}" name="default" v-model="curDefault"/></td>
            <td>
                <i v-if="item.id"
                   class="iconfont icon-del"
                   title="删除"
                   @click="delPlan(item.id)"></i>
                <i v-else 
                   class="iconfont icon-add"
                   title="添加"
                   @click="doAddPlan"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </modal>
</template>

<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import { onDragStart, onDragOver, onDragEnd } from './dragAndDrop'
  import * as service from 'src/service/home/deployBuild'

  export default {
    components: { modal },
    props: {
      type: {
        type: String,
        default: 'deploy'
      },
      doSubmit: {
        type: Function,
        default: function(){}
      },
    },
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        planId: '',
        deployPlanList: [],
        batchList: [],
        sourceBatchList: [],
        restList: [],
        excludeServerList: [],
        showModal: false,
        typeMap: {
          'deploy': '发布',
          'buildAndDeploy': '一键发布',
          'rollback': '回滚',
          'restart': '重启',
          'stop': '停止',
          'online': '上线',
          'offline': '下线'
        },

        obj: {
          clusterId: this.$route.query.clusterId,
          numOfBatch: 3,
          instanceInDiffBatch: false,
          instanceDivisionType: 'oneInFirstBatch',
          pauseType: 'pauseEachBatch',
          mulTemplates: [],
          justDeployedInstance: false,
        },

        //添加发布计划
        curPlanName: '',
        curDefault: false
      }
    },
    ready() {
      this.$parent.$parent.getClusterName(this.query);
      this.getDeployPlanList();
      this.type && this.getDeployedInstance();
    },
    computed: {
      showType(val) {
        if (this.type == 'restart' || this.type == 'stop' || this.type == 'online' || this.type == 'offline'){
          return false;
        }else {
          return true;
        }
      }
    },
    methods: {
      //获取已添加的分组配置
      getDeployPlanList() {
        service.getDeployPlanList(this.clusterId)
          .then((data) => {
            this.deployPlanList = data.list || [];
          });
      },
      //获取某一个发布计划
      changePlan(id) {
        service.getDeployPlanDetail(
          this.clusterId, { 
          planId: id
        }).then((data) => {
          this.batchList = data.batchList || [];
          this.handleContinue(this.batchList);
          this.obj = data.strategy;
          this.obj.mulTemplates = this.obj.mulTemplates.map((item) => {
            item.destTemplateId = item.sourceTemplateId;
            return item;
          });
        });
      },
      //完成后暂停去反
      handleContinue(list) {
        list.forEach((item) => {
          item.continueIfSuccess = !(item.continueIfSuccess);
        });
        return list;
      },
      doBatch() {
        this.obj.justDeployedInstance = !this.showType;
        service.getDivision(this.obj)
          .then((data) => {
            this.sourceBatchList = JSON.parse(JSON.stringify(data.list)) || [];
            this.batchList = JSON.parse(JSON.stringify(data.list)) || [];
            this.batchList.map((item, index) => {
              item.instanceList.map((item1, index1) => {
                item1.type = index + '-' + index1;
                return item1;
              });
              return item;
            });
            this.sourceBatchList.map((item, index) => {
              item.instanceList.map((item1, index1) => {
                item1.type = index + '-' + index1;
                return item1;
              });
              return item;
            });
            this.excludeServerList = [];
            this.handleContinue(this.batchList);
          });
      },
      //跳转到集群页面
      go() {
        this.$router.go({path: '/home/deploy', query: this.query});
      },
      doCancel() {
        this.go();
      },
      //添加发布计划
      onAddPlan() {
        this.showModal = true;
        this.deployPlanList.push({
          planName: '',
          default: false
        });
      },
      doAddPlan() {
        if (!this.curPlanName){
          Vue.$alert('请输入发布名称', 'danger');
          return;
        }
        this.handleContinue(this.batchList);
        service.createDeployPlan({
          clusterId: +this.clusterId,
          planName: this.curPlanName,
          isDefault: !!this.curDefault,
          batchList: this.batchList
        }).then((data) => {
          Vue.$alert('添加发布计划成功', 'success');
          this.getDeployPlanList();
          this.showModal = false;
        });
      },
      delPlan(id) {
        service.delDeployPlan(this.clusterId, {
          planId: id
        }).then((data) => {
          Vue.$alert('删除发布计划成功', 'success');
          this.getDeployPlanList();
        });
      },
      getDeployedInstance() {
        service.getDeployedInstance(
          this.clusterId
        ).then((data) => {
          this.batchList = data.list || [];
        });
      },
      onDragStart(event) {
        onDragStart(event);
        this.oldId = event.target.parentNode.id;
      },
      onDragOver(event) {
        onDragOver(event);
      },
      onDragEnd(event) {
        onDragEnd(event);

        let id = event.target.id;
        let arr = id.split('-');
        // let oldId = event.srcElement.parentNode.id;
        let newId = event.toElement.parentNode.id;

        // if (this.oldId){

        // }else {
        //   this.excludeServerList = this.excludeServerList.filter((item) => {
        //     return item.id != id; 
        //   });
        // }
        // if (newId) {
        //   this.restList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
        //   this.batchList[newId].instanceList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
        //   // this.batchList[arr[0]].instanceList.$remove(this.batchList[arr[0]].instanceList[arr[1]]);
        //   this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter((item) => {
        //     return item.id != id;
        //   });
        // }else{
        //   this.excludeServerList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
        //   // this.batchList[arr[0]].instanceList.$remove(this.batchList[arr[0]].instanceList[arr[1]]);
        //   this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter((item) => {
        //     return item.id != id;
        //   });
        // }
        if (this.oldId == newId) return;

        if ((this.oldId || this.oldId == '0') && (newId || newId == '0')){ //分组上下移动
          this.batchList[newId].instanceList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
          this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter((item) => {
            return item.type != id;
          });
        }else if ((this.oldId || this.oldId == '0') && !(newId || newId == '0')){ //移到不发布组
          this.excludeServerList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
          this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter((item) => {
            return item.type != id;
          });
        }else if (!(this.oldId || this.oldId == '0') && (newId || newId == '0')){ //不发布组移到发布组
          this.excludeServerList = this.excludeServerList.filter((item) => {
            return item.type != id; 
          });
          this.batchList[newId].instanceList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
        } else { //不发布组之间移动

        }
        this.oldId = '';
        this.$log('batchList');
      }
    }
  }

</script>

<style lang="less" scoped>
h3 {
  font-size: 16px;
  margin-bottom: 10px;
}
.m-group {
  .gr-left {
    width: 45%;
    .item {
      margin-bottom: 20px;
      p {
        line-height: 40px;
      }
      .item-table {
        
      }
    }
  }
  .gr-right {
    width: 45%;
    margin-top: 50px;
    h3 {
      font-size: 14px;
    }
  }
  .item-table {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid #efefef;
  }
  tr.z-dragSource {
    border: 2px dashed #00c0ef;
    background: transparent;
    font-size: 0;
  }
}

.ft {
  margin: 20px;
  text-align: center;
}

.normal {
    background-color: grey;
}
.drag {
    background-color: green;
}
.dragArea{
     min-height: 10px;  
}
 
/* 小屏幕 */
@media screen 
    and (min-width: 600px)
    and (max-width: 1366px) {
    .m-table th {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .m-table td {
      max-width: 100px;
    }
}
</style>