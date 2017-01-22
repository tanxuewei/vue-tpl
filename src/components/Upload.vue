<template>
  <div>
    <button class="u-btn" @click.prevent="upload">上传文件</button>
    <span>{{ fileName }}</span>
    <input type="file" 
          name="file" 
          v-el:file 
          @change="select"/>
  </div>
</template>
<script>
  export default {
    props: {
      fileName: {
        type: String,
        default: ''
      },
      fileTxt: {
        twoWay: true,
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        // fileName: ''
      }
    },
    ready(){
      this.$els.file.value = '';
    },
    methods: {
      upload() {
        this.$els.file.value = '';
        this.$els.file.click();
      },
      select() {
        this.fileName = this.$els.file.files[0].name;

        this.show && this.getFileTxt();
      },
      getFileTxt() {
        let self = this;
        let files = this.$els.file.files;
        this.fileName = '';

        if (files.length == 0) return;

        if (!(window.File || window.FileReader|| window.FileList || window.Blob)) return;

        let reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        reader.onload = function(evt){
          let fileString = evt.target.result;
          self.fileTxt = fileString;
        }
      }
    }
  }
</script>
<style lang="less">
input[type="file"] {
  display: none;
}
</style>