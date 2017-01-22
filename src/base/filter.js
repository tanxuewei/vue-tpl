/*
 * --------------------------------------------
 * vue模板过滤器
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import Vue from 'vue';

Vue.filter('tab', function(code){
  const companyTypeArr = [
          '我的任务2',
          '我的绩效表',
          '员工考核进度',
          '绩效汇总分析',
          '考核管理'
      ],
      codeArr = [1, 2, 3];
  const index = codeArr.indexOf(code);
  return companyTypeArr[index];
});

Vue.filter('format', function(date){

});