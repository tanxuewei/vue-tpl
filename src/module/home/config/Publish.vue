<template>
<div>
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a>&nbsp;>&nbsp;发布配置</p>
  <input type="button" 
           name="submit" 
           class="u-btn u-btn-primary mb10" 
           value="增加实例"
           @click="add"/>
    <table class="m-table">
        <thead>
            <tr>
                <th>实例</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="instance in instanceList">
                <td>{{ instance.instanceName }}</td>
                <td>{{ statusMap[instance.status] }}</td>
                <td>{{ instance.createTime | moment "YYYY-MM-DD HH:mm:ss" }}</td>
                <td>
                    <i class="iconfont icon-edit" @click="edit(instance.id)" title="配置"></i>
                    <i class="iconfont icon-del" @click="onDel(instance.id)" title="删除" style="margin-left: 5px;"></i>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<modal :show.sync="showModal" :submit="doSubmit" :modalclazz="'modal-large'">
    <h3 slot="header">{{ id?'修改':'添加'}}实例</h3>
    <div slot="body">
      <validator name="validation1">
      <form class="m-form" novalidate>
        <div class="fmitem">
            <label class="fmlab"><i>*</i>实例名称：</label>
            <div class="fmcnt">
                <template v-if="!id">
                    <input type="text" 
                       name="" 
                       class="u-ipt"
                       :class="{'check': check==true}"
                       v-model="obj.instanceName"
                       v-validate:instanceName="['required']"/>
                </template>
                <p v-else>{{ obj.instanceName }}</p>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">状态：</label>
            <div class="fmcnt">
                <select class="u-ipt"
                        v-model="obj.status">
                    <option value="1">enable</option>
                    <option value="0">disable</option>
                </select>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab"><i>*</i>发布账号：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       :class="{'check': check==true}"
                       v-model="obj.deployUser"
                       v-validate:deployUser="['required']"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">check_url：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="obj.checkUrl"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">online_url：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="obj.onlineUrl"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">offline_url：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="obj.offlineUrl"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">status_url：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="obj.statusUrl"/>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">端口：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="obj.port"/>
            </div>
        </div>
        <div class="fmitem" v-if="id">
            <label class="fmlab"><i>*</i>模板类型：</label>
            <div class="fmcnt">
              <input type="radio" v-model="templateType" name="type" value="1"/>原模板
              <input type="radio" v-model="templateType" name="type" value="2"/>变更模板
            </div>
        </div>
        <div class="fmitem" v-if="!id">
            <label class="fmlab"><i>*</i>模板：</label>
            <div class="fmcnt">
              <select v-model="obj.sourceTemplateId"
                      v-if="!id"
                      @change="changeTpl(obj.sourceTemplateId)">
                <option value="">请选择</option>
                <option value="{{ item.id }}" v-for="item in templates">{{ item.name }}</option>
              </select>
            </div>
        </div>
        <div class="fmitem" v-if="id">
            <label class="fmlab"><i>*</i>模板：</label>
            <div class="fmcnt">
                <template v-if="templateType==1">
                    <p>
                        {{ obj.sourceTemplate.name }}
                        <i class="iconfont icon-del-2"
                           v-if="obj.replaceTemplate"
                           @click="onDelSourceTpl"></i>
                    </p>
                </template>
                <template v-if="templateType==2">
                    <p v-if="obj.replaceTemplate && obj.replaceTemplate.id">
                        {{ obj.replaceTemplate.name }}
                        <i class="iconfont icon-del-2"
                           v-if="obj.sourceTemplate"
                           @click="onDelReplaceTpl"></i>
                    </p>
                    <p else>
                        <span class="u-btn u-btn-primary"
                              v-if="!onAddTplFlag" 
                              @click="onAddReplaceTpl">添加</span>
                    </p>
                    <select v-model="obj.replaceTemplateId"
                            v-if="onAddTplFlag"
                            @change="changeTpl(obj.replaceTemplateId)">
                        <option value="">请选择</option>
                        <option value="{{ item.id }}" v-for="item in templates">{{ item.name }}</option>
                    </select>
                    <span v-if="onAddTplFlag" class="u-btn u-btn-primary ml30" @click="doAddReplaceTpl">保存</span>
                    <span v-if="onAddTplFlag" class="f-red">保存后才能生效</span>
                </template>
            </div>
        </div>
        <div class="fmitem" 
            v-for="item in (templateType==2?replaceBaseSoftwareConfigs:baseSoftwareConfigs)">
            <label class="fmlab">{{ item.baseSoftwareConfig.name }}：</label>
            <div class="fmcnt">
                <div class="m-form">
                    <div class="fmitem">
                        <label class="fmlab">描述：</label>
                        <div class="fmcnt">
                            {{ item.baseSoftwareConfig.descp }}
                        </div>
                    </div>
                    <div class="fmitem">
                        <label class="fmlab">占位符：</label>
                        <div class="fmcnt">
                            <table class="m-table">
                              <thead>
                                  <tr>
                                      <th>占位符</th>
                                      <th>类型</th>
                                      <th>是否唯一</th>
                                      <th>是否必填</th>
                                      <th>是否默认</th>
                                      <th>值</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="val in item.baseSoftwareConfig.placeholderList">
                                      <td>{{ val.name || val.placeholderName }}</td>
                                      <td>{{ val.dataType }}</td>
                                      <td>{{ val.instanceUnique==true?'是':'否' }}</td>
                                      <td>{{ val.mandatory==true?'是':'否' }}</td>
                                      <td>
                                          <input type="checkbox" 
                                                 value="{{ val.adoptDefault }}" 
                                                 :disabled="!val.defaultValue"
                                                 v-model="val.adoptDefault"/>默认
                                      </td>
                                      <td>
                                          <input class="u-ipt u-ipt-auto" 
                                                 v-if="}"
                                                 value="111"
                                                 :disabled="val.adoptDefault==true"/>
                                          <input class="u-ipt u-ipt-auto" 
                                                 value="111"
                                                 :disabled="val.adoptDefault==true" 
                                                 v-model="val.placeholderValue"/>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
            <label class="fmlab">发布的动作：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="sourceActions.deploy"/>
            </div>
        </div>
        <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
            <label class="fmlab">重启的动作：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="sourceActions.restart"/>
            </div>
        </div>
        <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
            <label class="fmlab">停止容器的动作：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="sourceActions.stop"/>
            </div>
        </div>
        <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
            <label class="fmlab">上线的动作：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="sourceActions.online"/>
            </div>
        </div>
        <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
            <label class="fmlab">下线的动作：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="" 
                       class="u-ipt"
                       v-model="sourceActions.offline"/>
            </div>
        </div>
        <!-- <div class="fmitem" v-if="baseLength==0">
            <label class="fmlab">基础配件：</label>
            <div class="fmcnt">
                无
            </div>
        </div> -->
      </form>
      </validator>
    </div>
  </modal>
  <modal :show.sync="showDelModal" :submit="doDel">
    <h3 slot="header">删除实例</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该实例么？</p>
    </div>
  </modal>
  <modal :show.sync="showDelTpl" :submit="delType==1?doDelSourceTpl:doDelReplaceTpl">
    <h3 slot="header">删除模板</h3>
    <div slot="body">
      <p class="tip"><i class="iconfont icon-tip"></i>确定删除该模板么？</p>
    </div>
  </modal>
</template>

<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/home/publish'

  export default {
    components: { modal },
    data () {
      return {
        id: '',
        clusterName: '',
        instanceList: [],
        clusterName: '',
        clusterId: this.$route.query.clusterId,

        showModal: false,
        showDelModal: false,
        showDelTpl: false,
        delType: 1,

        //添加页面
        templateId: '',
        templates: [],
        curTpl: {},
        baseSoftwareConfigs: [],
        replaceBaseSoftwareConfigs: [],
        baseLength: 0,
        statusMap: ['disable', 'enable'],
        obj: this.initObj(),
        sourceActions: this.actionsObj(),
        replaceActions: this.actionsObj(),
        templateType: '1',
        onAddTplFlag: false
      }
    },
    ready() {
      this.getList();
      this.$parent.getClusterName(this.$route.query);
    },
    watch: {
      'templateType': function(val, oldVal){
        switch(val){
          case '1':
            // this.baseSoftwareConfigs = 
          break;
          case '2':
          break;
        }
      }
    },
    methods: {
      initObj() {
        return {
          clusterId: +this.$route.query.clusterId,
          //实例部分
          instanceName: '',
          sourceTemplateId: '',
          status: 1,
          deployUser: '',
          checkUrl: '',
          onlineUrl: '',
          offlineUrl: '',
          statusUrl: '',
          port: '',
          //模板部分
          sourcePlaceholders: [],
          sourceTemplate: {
            id: '',
            name: '',
            actions: [],
            baseSoftwareConfigList: []
          },
          replaceTemplateId: '',
          replacePlaceholders: [],
          replaceTemplate: {
            id: '',
            name: '',
            actions: [],
            baseSoftwareConfigList: []
          },
        }
      },
      actionsObj() {
        return {
          deploy: '',
          restart: '',
          stop: '',
          online: '',
          offline: ''
        }
      },
      getList() {

        service.getList(this.clusterId)
          .then((data) => {
            this.instanceList = data.list || [];
          });
      },
      getClusterConfig() {

        service.getClusterConfig(this.clusterId)
          .then((data) => {
            this.templates = data.templates || [];
          });
      },
      add() {
        this.id = '';
        this.templateType = 0;
        this.templateId = '';
        this.obj = this.initObj();
        this.sourceActions =  this.actionsObj(),
        this.baseSoftwareConfigs = [];
        this.getClusterConfig();
        this.showModal = true;
      },
      handleActions(obj) {
        let arr = [];
        for (let key in obj){
          arr.push({
            actionType: key,
            parameter: obj[key]
          });
        }
        return arr;
      },
      unHandleActions(list) {
        let obj = {};
        list.forEach((item) => {
          item.actionType && (obj[item.actionType] = item.parameter);
        });
        return obj;
      },
      handlePlaceholders(configs, placeholders) {
        let tempList = [];
        configs.forEach((item) => {
          tempList = tempList.concat(item.baseSoftwareConfig.placeholderList);
        });
        this.obj[placeholders] = tempList;
        
        for (let j=0, len=tempList.length; j<len; j++){
          let item = tempList[j];
          item.placeholderName = item.placeholderName || item.name;
          if (item.mandatory && !item.adoptDefault && !item.placeholderValue){
            return;
          }
        }
        return true;
      },
      renderTpl(configs, list) {
        configs.forEach((item) => {
          item.baseSoftwareConfig = item;
          item.baseSoftwareConfig.placeholderList = _.findInArr(list, 'baseSoftwareConfigId', item.id);
        });
        return configs;
      },
      edit(id) {
        let self = this;
        this.id = id;
        this.templateId = '';
        this.showModal = true;
        
        service.get({
          instanceId: id,
          clusterId: this.clusterId
        }).then((data) => {
          self.templateType = '1';
          self.obj = data;
          self.baseSoftwareConfigs = self.obj.sourceTemplate?self.obj.sourceTemplate.baseSoftwareConfigList:[];
          self.replaceBaseSoftwareConfigs = self.obj.replaceTemplate?self.obj.replaceTemplate.baseSoftwareConfigList:[];
          data.sourcePlaceholders && (self.baseSoftwareConfigs = self.renderTpl(self.baseSoftwareConfigs, data.sourcePlaceholders));
          data.replacePlaceholders && (self.replaceBaseSoftwareConfigs = self.renderTpl(self.replaceBaseSoftwareConfigs, data.replacePlaceholders));
          this.sourceActions = self.unHandleActions(self.obj.sourceTemplate.actions || []);
        });
      },
      changeTpl(id) {
        this.templateId = id;
        this.curTpl = _.findInMap(this.templates, 'id', id);
        if (this.templateType == '2'){ //变更模板
          this.replaceBaseSoftwareConfigs = this.curTpl?this.curTpl.templateSoftwareList:[];
        }else{
          this.baseSoftwareConfigs = this.curTpl.templateSoftwareList;
        }
      },
      doSubmit() {
        if (!this.handlePlaceholders(this.baseSoftwareConfigs, 'sourcePlaceholders')){
          Vue.$alert('如果占位符不是必填，必须要设置默认值', 'danger');
          return;
        }
        //整理模板下发布信息
        this.obj.sourceTemplate.actions = this.handleActions(this.sourceActions);
        // this.$log('obj');return;

        if (!!this.id){

          service.edit(this.obj)
            .then((data) => {
              Vue.$alert('修改成功', 'success');
              this.showModal = false;
              this.getList();
            });
        }else{
          
          service.add(this.obj)
            .then((data) => {
              Vue.$alert('添加成功', 'success');
              this.showModal = false;
              this.getList();
            });
        }
      },
      onDel(id) {
        this.id = id;
        this.showDelModal = true;
      },
      doDel() {
        service.del({
          instanceId: this.id,
          clusterId: this.clusterId
        }).then((data) => {
            Vue.$alert('删除实例成功', 'success');
            this.showDelModal = false;
            this.getList();
          });
      },
      //添加变更模板
      onAddReplaceTpl() {
        this.getClusterConfig();
        this.obj.replaceTemplateId = '';
        this.onAddTplFlag = true;
      },
      doAddReplaceTpl() {
        if (!this.handlePlaceholders(this.replaceBaseSoftwareConfigs, 'replacePlaceholders')){
          Vue.$alert('所有占位符必须要设置默认值', 'danger');
          return;
        }
        this.obj.replaceTemplate = {
          actions: this.handleActions(this.replaceActions)
        }
        service.addReplaceTpl(this.obj)
          .then((data) => {
            Vue.$alert('添加变更模板成功', 'success');
            this.showModal = false;
          });
      },
      //点击- 删除原模板
      onDelSourceTpl() {
        this.delType = 1;
        this.showDelTpl = true;
      },
      //确认--删除原模板
      doDelSourceTpl() {
        service.delSouceTpl({
          instanceId: this.id,
          clusterId: this.clusterId
        }).then((data) => {
            Vue.$alert('删除原模板成功', 'success');
          
        });
      },
      //点击 -- 删除变更模板
      onDelReplaceTpl() {
        this.delType = 2;
        this.showDelTpl = true;
      },
      //确认 -- 删除变更模板
      doDelReplaceTpl() {
        service.delReplaceTpl({
          instanceId: this.id,
          clusterId: this.clusterId
        }).then((data) => {
            Vue.$alert('删除变更模板成功', 'success');
        });
      }
    }
  }
</script>

<style lang="less">

</style>