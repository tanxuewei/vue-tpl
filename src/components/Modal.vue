<template>
   <div class="modal-mask" v-show="show" transition="modal">
    <div class="modal-wrapper">
      <div class="modal-container" :class="modalclazz">

        <div class="modal-header">
          <i class="iconfont icon-del-2" @click="show = false"></i>
          <slot name="header">
            default header
          </slot>
        </div>
        
        <div class="modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="modal-footer u-btns" v-if="bottomBar">
          <slot name="footer">
            <button class="u-btn"
              @click="show = false">
              取消
            </button>
            <button class="u-btn u-btn-primary"
              @click="submit">
              确定
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
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
      },
      bottomBar: {
        type: Boolean,
        default: true
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
  width: 680px;
}
.modal-large {
  width: 850px;
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
  line-height: 20px;
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
  .no-data {
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0;
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