<template>
    <ul class="m-pager f-fr">
        <li 
            title="上一页"
            :class="prevClasses"
            @click="prev">
            <a><i class="iconfont icon-arrow-left"></i></a>
        </li>
        <li
            title="第一页"
            :class="[`${prefixCls}`, {[`${prefixCls}-act`]: current == 1}]"
            @click="changePage(1)">
            <a>1</a>
        </li>
        <li 
            title="向前 5 页" 
            v-if="current - 3 > 1" 
            :class="[`${prefixCls}-jump-prev`]" 
            @click="fastPrev">
            <a>...</a>
        </li>
        <li 
            :title="current - 2" 
            v-if="current - 2 > 1" 
            :class="[`${prefixCls}`]" 
            @click="changePage(current - 2)">
            <a>{{ current - 2 }}</a>
        </li>
        <li 
            :title="current - 1" 
            v-if="current - 1 > 1" 
            :class="[`${prefixCls}`]"
            @click="changePage(current - 1)">
            <a>{{ current - 1 }}</a>
        </li>
        <li 
            :title="current" 
            v-if="current != 1 && current != allPages" 
            :class="[`${prefixCls}`,`${prefixCls}-act`]">
            <a>{{ current }}</a>
        </li>
        <li 
            :title="current + 1" 
            v-if="current + 1 < allPages" 
            :class="[`${prefixCls}`]" 
            @click="changePage(current + 1)">
            <a>{{ current + 1 }}</a>
        </li>
        <li 
            :title="current + 2" 
            v-if="current + 2 < allPages" 
            :class="[`${prefixCls}`]" 
            @click="changePage(current + 2)">
            <a>{{ current + 2 }}</a>
        </li>
        <li 
            title="向后 5 页" 
            v-if="current + 3 < allPages" 
            :class="[`${prefixCls}-jump-next`]" 
            @click="fastNext">
            <a>...</a>
        </li>
        <li 
            :title="'最后一页:' + allPages" 
            v-if="allPages>1"
            :class="[`${prefixCls}`, {[`${prefixCls}-act`]: current == allPages}]" 
            @click="changePage(allPages)">
            <a>{{ allPages }}</a>
        </li>
        <li 
            title="下一页"
            :class="nextClasses"
            @click="next">
            <a><i class="iconfont icon-arrow-right"></i></a>
        </li>
    </ul>
</template>
<script>
  const prefixCls = 'i-page';
  export default {
    props: {
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {
        prefixCls: prefixCls
      }
    },
    computed: {
      allPages() {
        return Math.ceil(this.total / this.pageSize);
      },
      prevClasses () {
          return [
              `${prefixCls}-prev`,
              {
                  [`${prefixCls}-disabled`]: this.current == 1
              }
          ]
      },
      nextClasses () {
          return [
              `${prefixCls}-next`,
              {
                  [`${prefixCls}-disabled`]: this.current == this.allPages
              }
          ]
      }
    },
    methods: {
      changePage (page) {
          if (this.current != page) {
              this.current = page;
              this.$emit('on-change', page);
          }
      },
      prev () {
          const current = this.current;
          if (current <= 1) {
              return false;
          }
          this.changePage(current - 1);
      },
      next () {
          const current = this.current;
          if (current >= this.allPages) {
              return false;
          }
          this.changePage(current + 1);
      },
      fastPrev () {
          const page = this.current - 5;
          if (page > 0) {
              this.changePage(page);
          } else {
              this.changePage(1);
          }
      },
      fastNext () {
          const page = this.current + 5;
          if (page > this.allPages) {
              this.changePage(this.allPages);
          } else {
              this.changePage(page);
          }
      },
    }
  }
</script>
<style lang="less" scoped>
@color: #ce3d3a;
.m-pager {
  margin: 20px 0;
  height: 40px;
  li {
    float: left;
    a {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #e5e5e5;
      border-left: none;
      box-sizing: border-box;
      background: #fff;
      color: #333;
      text-align: center;
      &:hover {
        color: @color;
      }
    }
  }
  li:first-child a{
    border-left: 1px solid #e5e5e5;
  }
  li.i-page-act a {
    border: 1px solid @color;
    background: @color;
    color: #fff;
  }
  li.i-page-disabled a {
    color: #ccc;
    cursor: not-allowed;
    i:hover {
      color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>