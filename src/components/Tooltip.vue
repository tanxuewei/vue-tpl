<template>
  <span v-el:trigger>
    <slot></slot>
  </span>
  <div v-el:popover v-if="show" style="display:block;"
    :class="['tooltip',placement]"
    :transition="effect">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      <slot name="content">{{content}}</slot>
   </div>
  </div>
</template>

<script>
import PopoverMixin from './popoverMixins.js'
export default {
  mixins: [PopoverMixin],
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    effect: {
      type: String,
      default: 'scale'
    },
    content: {
      type: String
    }
  }
}
</script>

<style>
.tooltip {
    position: absolute;
    z-index: 1070;
    display: block;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
    white-space: normal;
    filter: alpha(opacity=0);
    opacity: 0;
    line-break: auto;
}
.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
}
.tooltip.top .tooltip-arrow {
    bottom: -5px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000;
}
.tooltip-inner {
    max-width: 250px;
    padding: 6px 8px;
    color: #fff;
    text-align: center;
    background-color: #000;
    border-radius: 4px;
}
.tooltip.top,
.tooltip.left,
.tooltip.right,
.tooltip.bottom {
  opacity: .9
}
.fadein-enter {
  animation:fadein-in 0.3s ease-in;
}
.fadein-leave {
  animation:fadein-out 0.3s ease-out;
}
@keyframes fadein-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: .9;
  }
}
@keyframes fadein-out {
  0% {
    opacity: .9;
  }
  100% {
    opacity: 0;
  }
}
</style>