<template>
<div class="m-auth">
    <p class="tlt"><a v-link="{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}">{{ clusterName }}</a>&nbsp;>&nbsp;权限配置</p>
    <form class="m-form">
        <div class="fmitem">
            <label class="fmlab">集群责任人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.clusterOwners">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">应用责任人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.appOwners">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">产品责任人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.productOwners">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">集群发布人：</label>
            <div class="fmcnt">
                <!-- <select2></select2> -->
                <ul class="per">
                  <li v-for="item in result.clusterDeployers">{{ item.name || item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">应用发布人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.appDeployers">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">PE主责任人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.peMaster">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">PE次责任人：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.peSlave">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">PE专家：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.peExpert">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <div class="fmitem">
            <label class="fmlab">QA：</label>
            <div class="fmcnt">
                <ul class="per">
                  <li v-for="item in result.qa">{{ item.userName }}<span v-if="item.account">({{ item.account }})</span></li>
                </ul>
            </div>
        </div>
        <!-- <div class="fmitem">
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
        </div> -->
    </form>
</div>
</template>

<script>
  import Vue from 'vue'
  import select2 from 'src/components/select2.vue'
  import * as service from 'src/service/home/auth'

  export default {
    components: { select2 },
    data () {
      return {
        query: this.$route.query,
        clusterId: this.$route.query.clusterId,
        clusterName: '',
        result: {
          clusterOwners: [],
          appOwners: [],
          productOwners: [],
          clusterDeployers: [],
          appDeployers: [],
          peMaster: [],
          peSlave: [],
          peExpert: [],
          qa: []
        }
      }
    },
    ready() {
      this.getPersonInCharge();
      this.$parent.getClusterName(this.query);
    },
    methods: {
      getPersonInCharge() {

        service.getPersonInCharge(this.clusterId)
          .then((data) => {
            this.result = data || {};
            for (let key in data){
              if (data[key].length == 0){
                this.result[key].push({ userName: '无'});
              }
            }
          });
      },
      //跳转到集群页面
      go() {
          this.$router.go({path: '/home/list', query: { productId: this.query.productId, appId: this.query.appId }});
      },
      add() {
        
        service.update(
            this.obj
        ).then((data) => {

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
.m-auth {
  ul.per {
    li {
      float: left;
      margin-right: 15px;
      cursor: pointer;
      span {
        display: none;
      }
      &:hover {
        span {
          display: inline;
        }
      }
    }
  }
}
</style>