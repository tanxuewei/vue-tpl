<template>
  <div>
    <slot name="table"></slot>
    <p class="n-data">暂无数据</p>
    <pager :total="100" v-ref:pager></pager>  
  </div>
</template>
<script>
  import pager from 'src/components/Pager.vue'

  export default {
    components: { pager },
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true    
      },
      submit: {
        type: Function,
        default () {
          this.show = false;
        }
      },
      modalclazz: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="less">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-mid {
  width: 650px;
}
.modal-large {
  width: 800px;
}

.modal-header {
  position: relative;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
  i {
    position: absolute;
    right: 15px;
    top: 15px;
    // opacity: .5;
    cursor: pointer;
    font-size: 14px;
  }
  h3 {
    margin: 0;
    color: #CE3D3A;
    font-size: 16px;
    text-align: center;
  }
}

.modal-body {
  position: relative;
  padding: 15px;
  max-height: 400px;
  overflow: auto;
  .tip {
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    i {
      margin-right: 10px;
    }
  }
  h3.title {
    margin-bottom: 15px;
  }
}

.modal-no-auto .modal-body {
  overflow: inherit;
}
.modal-footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #e5e5e5;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>