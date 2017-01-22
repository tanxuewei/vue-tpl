<template>
    <div>
      <form class="m-form">
        <div class="fmitem">
            <label class="fmlab">组别</label>
            <div class="fmcnt">
                <v-select :value.sync="value" :options.sync="options"></v-select>
                <input type="button" 
                       name="" 
                       class="u-btn u-btn-primary ml30" 
                       value="刷新"
                       @click="search('refresh')"/>
            </div>
        </div>
      </form>
    </div>
    <table class="m-table">
        <thead>
            <tr>
                <th>Sn</th>
                <th>主IP</th>
                <th>主机名</th>
                <th>服务可用状态</th>
                <th>运行任务数</th>
                <th>机器存活状态</th>
                <th>映射IP</th>
                <th>端口</th>
                <th>服务配置</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in serverList">
                <td>{{ item.serverSn }}</td>
                <td>{{ item.hostIp }}</td>
                <td title="{{ item.hostName }}">{{ item.hostName }}</td>
                <td title="{{ item.appStatus }}">{{ item.appStatus }}</td>
                <td>{{ item.runningTaskCount }}</td>
                <td>{{ item.status }}</td>
                <td title="{{ item.serverIPs }}">{{ item.serverIPs }}</td>
                <td>{{ item.port }}</td>
                <td>
                  <span v-if="item.appStatus == 'enable'"
                        class=" u-btn u-btn-s1" 
                        @click="doSetStatus(item, 'disable')">
                        disable
                  </span>
                  <span v-else>
                    <span v-if="item.appStatus == 'exception'"
                        class=" u-btn u-btn-s1 u-btn-dis">
                        enable
                    </span>
                    <span v-else
                        class=" u-btn u-btn-s1" 
                        @click="doSetStatus(item, 'enable')">
                        enable
                  </span>
                  </span>
                </td>
                <td>
                  <span class=" u-btn u-btn-s1" @click="doSet(item.id)">修改</span>
                </td>
            </tr>
        </tbody>
    </table>
    <modal :show.sync="showModal" :submit="doSubmit">
      <h3 slot="header">设置</h3>
      <div slot="body">
        <form class="m-form">
          <div class="fmitem">
              <label class="fmlab">集群ID：</label>
              <div class="fmcnt">
                  {{ obj.clusterId }}
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab">Sn：</label>
              <div class="fmcnt">
                  {{ obj.serverSn }}
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab">机器存活状态：</label>
              <div class="fmcnt">
                  <select class="u-ipt" v-model="obj.status">
                    <option value="online">online</option>
                    <option value="offline">offline</option>
                  </select>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab">映射IP：</label>
              <div class="fmcnt">
                  <textarea class="u-ipt"
                            v-model="obj.serverIPs">
                  </textarea>
                  <p class="f-red">多个IP以英文逗号(,)分隔</p>
              </div>
          </div>
          <div class="fmitem">
              <label class="fmlab">端口：</label>
              <div class="fmcnt">
                  <input type="text" 
                        name=""
                        class="u-ipt"
                        v-model="obj.port" />
              </div>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import modal from 'src/components/Modal.vue'
  import select from 'src/components/Select.vue'
  import _ from 'src/base/util'
  import * as service from 'src/service/sysConfig/buildServerManage'

  export default {
    components: { 
      vSelect: select,
      modal: modal
    },
    data () {
      return {
        value: '',
        options: [],
        serverList: [],
        showModal: false,
        obj: {
          status: '',
          ip: '',
          port: ''
        }
      }
    },
    ready() {
      this.getAllServer();
    },
    watch: {
      'value': function(val, oldVal){
        this.search();
      }
    },
    methods: {
      getAllServer() {
        service.getAllServer({})
          .then((data) => {
            this.options = _.optionsData(data.list||[], 'clusterId', 'clusterName');
          });
      },
      search(type) {
        if (!this.value) {
          Vue.$alert('请选择组别!', 'danger');
          return;
        }
        service.getServerByGroup(this.value)
          .then((data) => {
            !!type && Vue.$alert('刷新成功', 'success');
            this.serverList = data.list || [];
          });
      },
      doSet(id) {
        this.showModal = true;
        service.getServerDetail(id)
          .then((data) => {
            this.obj = data||{};
          });
      },
      checkIPs(value) {
        let arr = value.trim().split(',');
        for (let i=0,len=arr.length; i<len; i++){
          if (arr[i].trim() && !_.checkIp(arr[i].trim())){
            return false;
          }
        }
        return true;
      },
      doSubmit() {
        let reg1 = /^\d+$/i;

        if (!this.checkIPs(this.obj.serverIPs)){
          Vue.$alert('请输入合法的IP，多个IP以,分隔', 'danger');
          return;
        }
        if (!reg1.test(this.obj.port)){
          Vue.$alert('端口只能是数字', 'danger');
          return;
        }
        service.setServer(this.obj)
          .then((data) => {
            Vue.$alert('修改成功', 'success');
            this.showModal = false;
            this.search();
          });
      },
      doSetStatus(item, status) {
        service.setServerStatus({
          sn: item.serverSn,
          status: status,
          ip: item.serverIPs,
          port: item.port
        }).then((data) => {
          (data == 'ok') ? Vue.$alert('服务设置成功', 'success') : Vue.$alert(data, 'danger');
          this.search();
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .avatar {
    height: 75px;
    margin: 10px auto;
  }
  .user-details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    margin: -10px 0;
  }
  .time-block {
    padding: 10px;
  }
  .comment-section {
    padding: 20px;
  }
</style>
