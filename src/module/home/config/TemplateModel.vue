<template>
  <div class="fmitem" 
      v-for="item in configs">
      <label class="fmlab">{{ item.baseSoftwareConfig.name }}：</label>
      <div class="fmcnt">
          <div class="m-form">
              <div class="fmitem">
                  <label class="fmlab">描述：</label>
                  <div class="fmcnt">
                      {{ item.baseSoftwareConfig.descp }}
                  </div>
              </div>
              <div class="fmitem">
                  <label class="fmlab">占位符：</label>
                  <div class="fmcnt">
                      <table class="m-table">
                        <thead>
                            <tr>
                                <th>占位符</th>
                                <th>类型</th>
                                <th>是否唯一</th>
                                <th>是否默认</th>
                                <th>值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="val in item.baseSoftwareConfig.placeholderList">
                                <td>{{ val.name || val.placeholderName }}</td>
                                <td>{{ val.dataType }}</td>
                                <td>{{ val.instanceUnique==true?'是':'否' }}</td>
                                <td>
                                    <input type="checkbox" 
                                           value="{{ val.adoptDefault }}" 
                                           :disabled="!val.defaultValue"
                                           v-model="val.adoptDefault"/>默认
                                </td>
                                <td>
                                    <input class="u-ipt u-ipt-auto" 
                                           value="{{ !val.defaultValue?val.placeholderValue:(val.adoptDefault==true?val.defaultValue:val.placeholderValue) }}"
                                           :disabled="val.adoptDefault==true" 
                                           v-model="val.placeholderValue"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
      <label class="fmlab">发布的动作：</label>
      <div class="fmcnt">
          <input type="text" 
                 name="" 
                 class="u-ipt"
                 v-model="sourceActions.deploy"/>
      </div>
  </div>
  <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
      <label class="fmlab">重启的动作：</label>
      <div class="fmcnt">
          <input type="text" 
                 name="" 
                 class="u-ipt"
                 v-model="sourceActions.restart"/>
      </div>
  </div>
  <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
      <label class="fmlab">停止容器的动作：</label>
      <div class="fmcnt">
          <input type="text" 
                 name="" 
                 class="u-ipt"
                 v-model="sourceActions.stop"/>
      </div>
  </div>
  <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
      <label class="fmlab">上线的动作：</label>
      <div class="fmcnt">
          <input type="text" 
                 name="" 
                 class="u-ipt"
                 v-model="sourceActions.online"/>
      </div>
  </div>
  <div class="fmitem" v-if="(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId">
      <label class="fmlab">下线的动作：</label>
      <div class="fmcnt">
          <input type="text" 
                 name="" 
                 class="u-ipt"
                 v-model="sourceActions.offline"/>
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
  
</style>