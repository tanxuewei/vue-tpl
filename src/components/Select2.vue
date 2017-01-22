<template>
  <div class="m-select2">
    <div class="select-box f-cb">
      <input type="search" 
             class="u-ipt"
             v-model="value"
             @input="search"/>
    </div>
    <dropdown :show.sync="false">
      <li>111</li>
      <li>111</li>
      <li>111</li>
    </dropdown>
  </div>
</template>
<script>
  import dropdown from './Dropdown.vue'
  import * as service from 'src/service/home/auth'
  export default {
    components: { dropdown },
    props: {

    },
    data() {
      return {
        value: ''
      }
    },
    ready() {

    },
    methods: {
      search() {
        service.searchUser({
          word: this.value
        }).then((data) => {

        });
      }
    }
  }
</script>
<style lang="less">
.border-box {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
.m-select2 {
  width: auto;
  display: inline-block;
  .border-box();
  border: none;
  outline: none;
  margin: 0;
  padding: 0 .5em;
  max-width: 100%;
  background: none;
  box-shadow: none;
  float: left;
  clear: none;
}
</style>