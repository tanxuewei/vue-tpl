<template>
  <div
    v-show="show"
    v-bind:class="{
      'alert':		true,
      'alert-success':(type == 'success'),
      'alert-warning':(type == 'warning'),
      'alert-info':	(type == 'info'),
      'alert-danger':	(type == 'danger'),
      'top': 			(placement === 'top'),
      'top-right': 	(placement === 'top-right')
    }"
    transition="fade"
    v-bind:style="{'max-width':width}"
    role="alert">
    <!-- <button v-show="dismissable" type="button" class="close"
      @click="show = false">
      <span>&times;</span>
    </button> -->
    <p>{{ message }}</p>
  </div>
</template>

<script>
import coerceBoolean from './utils/coerceBoolean.js'
import coerceNumber from './utils/coerceNumber.js'

export default {
  props: {
    type: {
      type: String
    },
    dismissable: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    show: {
      type: Boolean,
      coerce: coerceBoolean,
      default: true,
      twoWay: true
    },
    duration: {
      type: Number,
      coerce: coerceNumber,
      default: 0
    },
    width: {
      type: String
    },
    placement: {
      type: String
    }
  },
  data() {
    return {
      message: ''
    }
  },
  watch: {
    show (val) {
      if (this._timeout) clearTimeout(this._timeout)
      if (val && Boolean(this.duration)) {
        this._timeout = setTimeout(() => { this.show = false }, this.duration)
      }
    }
  },
  methods: {
    open(text, state, duration) {
      this.message = text;
      this.type = state?state:'danger';
      this.show = true;
    }
  }
}
</script>

<style lang="less">
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter,
.fade-leave {
  height: 0;
  opacity: 0;
}
.alert.top {
  position: fixed;
  top: 30px;
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 10500;
  text-align: center;
}
.alert.top-right {
  position: fixed;
  top: 30px;
  right: 50px;
  z-index: 10000;
}

.alert p{
    padding: 11px 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
    display: inline-block;
}
.alert-danger p{
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
}
.alert-success p{
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
}
.alert-info p{
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bce8f1;
}
.alert-warning p{
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
}
</style>
