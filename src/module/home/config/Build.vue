<template>
<div>
  <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a>&nbsp;>&nbsp;构建配置</p>
  <validator name="validation1" novalidate>
    <form class="m-form">
      <div class="fmitem" v-if="obj.applicationType != 'python' && obj.applicationType != 'self_define' && obj.applicationType != 'static_resource'">
          <label class="fmlab"><i>*</i>依赖环境：</label>
          <div class="fmcnt">
              <select class="u-ipt"
                      v-model="obj.envDependency">
                  <option value="{{ item }}" v-for="item in envList">{{ item }}</option>
              </select>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab"><i>*</i>源码管理：</label>
          <div class="fmcnt">
              <div class="u-radios">
                <input type="radio" 
                       name="repoType"
                       class="u-radio"
                       value="git"
                       id="git"
                       v-model="obj.repoType"/>
                <label for="git">Git</label>
                <input type="radio" 
                       name="repoType"
                       class="u-radio"
                       value="svn"
                       id="svn"
                       v-model="obj.repoType"/>
                <label for="svn">Svn</label>
              </div>
              <template v-if="obj.repoType=='git'">
                <div class="fmitem">
                  <label class="fmlab"><i>*</i>Git仓库：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt u-ipt-mid"
                             :class="{'check': check==true}"
                             v-validate:gitRepo="['required']"
                             v-model="obj.gitRepo"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab"><i>*</i>Branch：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             :class="{'check': check==true}"
                             v-validate:gitBranch="['required']"
                             v-model="obj.gitBranch"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">Version：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.gitVersion"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">应用子目录：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.gitSubfolder"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab"><i>*</i>密钥：</label>
                  <div class="fmcnt">
                      <span class="mr10" v-if="obj.sshKeyId">{{ obj.sshInfo }}</span>
                      <select class="u-ipt"
                              v-model="obj.newSshKeyId">
                          <option value="">请选择</option>
                          <option value="{{ item.id }}" v-for="item in sshkeyList">{{ item.name }}</option>
                      </select>
                  </div>
                </div>
              </template>
              <template v-if="obj.repoType=='svn'">
                <div class="fmitem">
                  <label class="fmlab"><i>*</i>Svn仓库：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt u-ipt-mid"
                             :class="{'check': check==true}"
                             v-validate:svnRepo="['required']"
                             v-model="obj.svnRepo"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">Version：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.svnVersion"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">应用子目录：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.gitSubfolder"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">Username：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.svnUsername"/>
                  </div>
                </div>
                <div class="fmitem">
                  <label class="fmlab">Password：</label>
                  <div class="fmcnt">
                      <input type="password" 
                             name="name" 
                             class="u-ipt"
                             v-model="obj.svnPassword"/>
                  </div>
                </div>
              </template>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab"><i>*</i>构建方式：</label>
          <div class="fmcnt">
              <select class="u-ipt"
                      v-model="obj.buildType">
                  <option value="{{ item }}" v-for="item in typeList">{{ item }}</option>
              </select>
          </div>
      </div>
      <div class="fmitem">
          <label class="fmlab"><i>*</i>build.xml：</label>
          <div class="fmcnt">
              <input type="radio" 
                     name="buildXml" 
                     value="AUTO"
                     checked
                     v-model="obj.buildXmlDefineMethod"/>自动生成
              <input type="radio" 
                     name="buildXml" 
                     value="CUSTOM"
                     v-model="obj.buildXmlDefineMethod"/>自定义提交
              <div>
                <textarea 
                        class="u-ipt u-mid"
                        :disabled="isCustom==false"
                        v-model="obj.buildXml"
                        placeholder="不能为空"></textarea>
                <p class="f-red" v-if="isCustom==false">自动生成时，文本框不可编辑</p>
              </div>
          </div>
      </div>
      <template v-if="obj.applicationType != 'python' && obj.applicationType != 'self_define' && obj.applicationType != 'static_resource'">
        <template v-if="obj.applicationType != 'javaapp'">
        <div class="fmitem" v-if="isCustom==false">
            <label class="fmlab"><i>*</i>NEJ配置：</label>
            <div class="fmcnt">
                <input type="radio" 
                       name="nejConfig" 
                       value="0"
                       checked
                       v-model="obj.nejConfig"/>否
                <input type="radio" 
                       name="nejConfig" 
                       value="1"
                       v-model="obj.nejConfig"/>是
                <div class="fmitem" v-if="isNEJ == true">
                  <label class="fmlab"><i>*</i>release.conf路径：</label>
                  <div class="fmcnt">
                      <input type="text" 
                             name="name" 
                             class="u-ipt"
                             placeholder="不能为空" 
                             v-model="obj.releaseConfPath"/>
                      <span>(如 src/main/webapp/deploy/release.conf)</span>
                  </div>
                </div>
            </div>
        </div>
        <div class="fmitem" v-if="isCustom==false">
            <label class="fmlab"><i>*</i>依赖父工程：</label>
            <div class="fmcnt">
                <input type="radio" 
                       name="dependParent" 
                       value="0"
                       checked
                       v-model="obj.dependParent"/>否
                <input type="radio" 
                       name="dependParent" 
                       value="1"
                       v-model="obj.dependParent"/>是
            </div>
        </div>
        </template>
        <div class="fmitem" v-if="isCustom==false">
            <label class="fmlab"><i>*</i>conf名称：</label>
            <div class="fmcnt">
                <input type="text" 
                       name="name" 
                       class="u-ipt"
                       :class="{'check': check==true}"
                       v-validate:confName="['required']"
                       v-model="obj.confName"/>
            </div>
        </div>
      </template>  
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
  </validator>
</div>
</template>

<script>
  import Vue from 'vue'
  import * as service from 'src/service/home/build'

  export default {
    data () {
      return {
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        envList: [],
        typeList: [],
        sshkeyList: [],

        //判断项
        isCustom: false,
        isNEJ: false,
        check: false,

        obj: {
          //类型
          applicationType: '',
          clusterId: this.$route.query.clusterId,
          //依赖环境
          envDependency: '',
          //源码管理
          repoType: 'git',
          gitRepo: '',
          gitBranch: '',
          gitVersion: '',
          gitSubfolder: '',
          sshKeyId: '',
          sshInfo: '',
          newSshKeyId: '',
          //svn
          svnRepo: '',
          svnVersion: '',
          svnUsername: '',
          svnPassword: '',

          buildType: 0,
          buildXml: '',
          //自定义时，文本框内容
          buildXmlDefineMethod: 'AUTO',
          nejConfig: 0,
          //如果nej为是，填写配置路径
          releaseConfPath: '',
          dependParent:0,
          confName: ''
        }
      }
    },
    computed: {

    },
    ready() {
      this.getBuildList();
      this.$parent.getClusterName(this.$route.query);
    },
    watch : {
      'obj.buildXmlDefineMethod': function(val, oldVal){
        // this.obj.buildXml = '';
        this.isCustom = (val == 'CUSTOM') ? true : false;
      },
      'obj.nejConfig': function(val, oldVal){
        (val!=1) && (this.obj.releaseConfPath = '');
        this.isNEJ = (val == 1) ? true : false;
      }
    },
    methods: {
      getBuildList() {

        service.getBuildEnv({})
          .then((data) => {
            this.envList = data.list || [];
            this.obj.envDependency = this.envList[0]?this.envList[0]:'';
          });

        service.getBuildType({clusterId: this.clusterId})
          .then((data) => {
            this.typeList = data.list || [];
            this.obj.buildType = this.typeList[0]?this.typeList[0]:'';
          });

        service.getSSHkey({})
          .then((data) => {
            this.sshkeyList = data.list || [];
          });

        service.get(this.clusterId)
          .then((data) => {
            if (data){
              this.obj = data;
            }
            this.obj.newSshKeyId = '';
            this.check = false;
            this.$resetValidation();
          });
      },
      //跳转到集群页面
      go() {
          this.$router.go({path: '/home/list', query: { productId: this.$route.query.productId, appId: this.$route.query.appId }});
      },
      add() {
        this.check = true;
        if (this.$validation1.invalid){
          Vue.$alert('请填写必填项', 'danger');
          return;
        }
        //如果是git
        if (this.obj.repoType == 'git') {

          if (!this.obj.sshKeyId && !this.obj.newSshKeyId){
            Vue.$alert('请选择密钥', 'danger');
            return;
          }
          this.obj.newSshKeyId && (this.obj.sshKeyId = this.obj.newSshKeyId);
        }
        //如果依赖父工程为是，应用子目录不能为空
        if (!this.isCustom && this.obj.dependParent == 1 && !this.obj.gitSubfolder) { 
          Vue.$alert('应用子目录不能为空', 'danger');
          return; 
        }
        if (!this.isCustom && this.isNEJ && !this.obj.releaseConfPath) { 
          Vue.$alert('release.conf路径不能为空', 'danger');
          return; 
        }
        if (this.isCustom && !this.obj.buildXml) { 
            Vue.$alert('选择自定义提交时，内容不能为空', 'danger');
            return;
          }
        service.add(this.obj)
          .then((data) => {
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