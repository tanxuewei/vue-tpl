<template>
<div class="fmitem" v-for="item in placeholderList">
    <label class="fmlab">{{ item.name }}：</label>
    <div class="fmcnt">
        <select class="u-ipt" v-model="item.dataType">
          <option value="INT">INT</option>
          <option value="DECIMAL">DECIMAL</option>
          <option value="STRING">STRING</option>
        </select>
        <input type="text" 
              class="u-ipt ml10"
              placeholder="请填写默认值" 
              v-model="item.defaultValue"/>
        <input type="checkbox" v-model="item.instanceUnique" class="ml10"/>唯一
        <input type="checkbox" v-model="item.mandatory" class="ml10"/>必填
    </div>
</div>
<div class="fmitem" v-if="placeholderList.length==0">
  <label class="fmlab"></label>
  <div class="fmcnt">
    <p class="no-data" >暂无占位符信息</p>
  </div>
</div>
</template>
<script>
  export default {
    props: {
      placeholderList: {
        type: Array,
        default: [],
      }
    },
    data () {
      return {
        
      }
    },
    ready(){
      
    },
    methods: {
      
    },
    events: {

    }
  }
</script>

<style lang="less">

</style>
