/*
 * --------------------------------------------
 * vue指令
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import Vue from 'vue';

Vue.directive('v-scroll', function(item, value) {
  console.log(value);
  this.$watch(value, function(newValue) {
    console.log(value);
      if(newValue && elem) {
          elem.parentElement.scrollTop = elem.offsetTop;
      }
  });
});