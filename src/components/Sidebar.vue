<template>
    <div class="m-sidebar">
        <ul class="list" v-if="$route.name != 'follow/list'">
          <li v-for="item in productList">
              <a :class="{ 'act': $route.query.productId == item.productId }"
                 title="{{ item.productName }}"
                 @click="selectProduct(item.productId)"
                 v-link="{path: '/home/list', exact: true, query: {'productId': item.productId}}">{{ item.productName }}</a>
          </li>
          <p v-if="noProductList" class="no-data">暂无产品</p>
        </ul>
        <ul class="list" v-if="$route.name == 'follow/list'">
          <li v-for="item in followedList">
              <a :class="{ 'act': $route.query.productId == item.productId }"
                 title="{{ item.productName }}"
                 @click="selectProduct(item.productId)"
                 v-link="{path: '/follow/list', exact: true, query: {'productId': item.productId}}">{{ item.productName }}</a>
          </li>
          <p v-if="noFollowedList" class="no-data">暂无产品</p>
        </ul>
    </div>
</template>

<script>
  import { getProductList, getFollowedProList } from 'src/service/common'

  export default {
    data(){
      return {
          productList: [],
          noProductList: false,
          followedList: [],
          noFollowedList: false,
          pId : this.$route.query.proId
      }
    },
    ready() {
      this.getProductList();
      this.getFollowedList();
    },
    methods: {
      getProductList() {
        getProductList({})
          .then((data) => {
            this.productList = data.list || [];
            this.noProductList = this.productList.length==0 ? true : false;
          });
      },
      getFollowedList() {
        getFollowedProList({})
          .then((data) => {
            this.followedList = data.list || [];
            this.noFollowedList = this.followedList.length==0 ? true : false;
          });
      },
      selectProduct(id) {
        this.$dispatch('selectProduct', id);
      }
    }
  }
</script>
<style lang="less">
@base: #CE3D3A;
@base-color: rgba(255,255,255,0.67);
@act-color: #fff;
@bg-color: #292F37;
.text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.m-sidebar {
  width: 156px;
  height: 100%;
  font-size: 12px;
  color: @base-color;
  background: @bg-color;
  .tlt {
    height: 54px;
    line-height: 54px;
    li {
      float: left;
      display: inline-block;
      width: 50%;
      background: #414954;
      text-align: center;
      cursor: pointer;
      a {
        color: @base-color;
        display: block;
        &:hover {
          color: @act-color;
        }
        &.act {
          color: @act-color;
          background: @bg-color;
        }
      }
    }
  }

  .list {
    background: @bg-color;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 64px;
    overflow-y: auto;
    margin-bottom: 0;
    li {
      height: 52px;
      line-height: 52px;

      a {
        display: block;
        padding: 0 20px 0 36px;
        .text-overflow();
        color: @base-color;
        &:hover {
          color: @act-color;
        }
      }
      a.act {
        background: #141618;
        color: @act-color;
        border-left: 4px solid @base;
      }
    }
  }
}
</style>
