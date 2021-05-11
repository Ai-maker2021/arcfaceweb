<template>
<!-- 温感设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="warmthSettings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
      :labelCol="{ span: 10}"
      :wrapperCol="{ span: 25 }"
    >
      <a-form-item :label="switchOpenLabel" class="bottom24">
        <a-switch
          class="switch"
          v-decorator="[
            'switchOpen',
            {
              valuePropName: 'checked',
            },
          ]"
        />
      </a-form-item>
      <!-- 是否语音播报 -->
      <a-form-item :label="voicebroadcastLabel" class="bottom24">
        <a-switch
         :disabled="Disabled"
          class="switch"
          v-decorator="[
            'voicebroadcastopen',
            {
              valuePropName: 'checked',
            },
          ]"
        />
      </a-form-item>
      <!-- 预警温度值 -->
      <a-form-item :label="warningTempLabel" class="toRight bottom24">
        <a-input-number
          :disabled="Disabled"
          :min="30"
          :max="40"
          :parser="limit"
          v-decorator="[
            'warningTemp',
            {
              rules: [
                {
                  required: true,
                  message: requireMessage,
                },
              ],
              validateTrigger: 'blur',
            },
          ]"
        />
        <span class="after-suffix">{{ $t("warmthSettings.suffix") }}</span>
     </a-form-item>
       <!-- 温感器接收延时  The temperature sensor accepts delay-->
     <a-form-item :label="acceptsdelayLabel" class="toRight bottom24">
        <a-input-number
         :disabled="Disabled"
          :precision="0"
          :min="0"
          :max="9999"
          :parser="limit"
          v-decorator="[
            'delay',
            {
              rules: [
                {
                  required: true,
                  message: requireMessage,
                },
              ],
              validateTrigger: 'blur',
            },
          ]"
        />
        <span class="after">{{ $t("warmthSettings.mintime") }}</span>
      </a-form-item>
      <!-- 陌生人测温模式 -->
      <a-form-item :label="strangertemperatureLabel" class="strag">
        <a-switch
         :disabled="Disabled"
          class="switch"
          v-decorator="[
            'strangertemperature',
            {
              valuePropName: 'checked',
            },
          ]"
        />
        <p class="txt">
          {{ $t("warmthSettings.txt") }}
        </p>
      </a-form-item>
      <!-- 重复测温 :disabled="methodsDisabled"
      -->
      <a-form-item :label="repeatedtemperatureLabel" class="bottom24">
        <a-switch
          :disabled="(Disabled==false)?methodsDisabled==false? false:true:true"
          class="switch"
          v-decorator="[
            'repeatedtemperature',
            {
              valuePropName: 'checked',
            },
          ]"
        />
      </a-form-item>
      <!-- 间隔时长 -->
      <!--"(Disabled==false)?interDisabled==false? false:true:true"-->
      <a-form-item :label="intervallengthLabel" class="toRight bottom24">
        <a-input-number
          :min="2"
          :max="8"
          :parser="limit"
          :disabled="(Disabled==false)?methodsDisabled==false?interDisabled==false? false:true:true:true"
          :precision="1"
          v-decorator="[
            'interval',
            {
              rules: [
                {
                  required: true,
                  message: requireMessage,
                },
              ],
              validateTrigger: 'blur',
            },
          ]"
        />
        <span class="after">{{ $t("warmthSettings.time") }}</span>
      </a-form-item>
      <a-form-item label=" " :colon="false" class="top64">
        <a-button
          class="btn"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ $t("warmthSettings.save") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "warmthSettings",
  data() {
    return {
      methodsDisabled:true,
      interDisabled:false,
      submitLoading: false,
      Disabled:false,
      // disabled:true
      stranger: false,
      common:false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "warmthSettings",
      onValuesChange: (props, values) => {
         if (values.hasOwnProperty("strangertemperature")) {
           //重复测温
          this.methodsDisabled= !values.strangertemperature;
        }
         if (values.hasOwnProperty("repeatedtemperature")) {
          this.interDisabled= !values.repeatedtemperature;
        }
         if (values.hasOwnProperty("switchOpen")) {
          this.Disabled= !values.switchOpen;
        }
      
      },
    });
  },
  computed: {
    switchOpenLabel: function () {
      return this.$t("warmthSettings.switchOpenLabel");
    },
    warningTempLabel: function () {
      return this.$t("warmthSettings.warningTempLabel");
    },
    requireMessage: function () {
      return this.$t("warmthSettings.required");
    },
    voicebroadcastLabel: function () {
      return this.$t("warmthSettings.voicebroadcastLabel");
    },
    strangertemperatureLabel: function () {
      return this.$t("warmthSettings.strangertemperatureLabel");
    },
    repeatedtemperatureLabel: function () {
      return this.$t("warmthSettings.repeatedtemperatureLabel");
    },
    intervallengthLabel: function () {
      return this.$t("warmthSettings.intervallengthLabel");
    },
    acceptsdelayLabel:function () {
      return this.$t("warmthSettings.acceptsdelayLabel");
    }
  },
  created(){
      this.getdefaultMsg();
  },
  methods: {
    // 校验传给接口的字段是否在规定范围内
    checkMaxAndMin(num,min,max){
      let val = 0;
      if(Number(num) > max){
        val = max;
      } else if(Number(num) < min){
        val = min;
      } else {
        val = Number(num);
      }
      return val;
    },
    // 保存设置
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true;
          let formData = new FormData();
          let ena = values.switchOpen === true ? 1 : 0;
          let voice = values.voicebroadcastopen === true ? 1 : 0;
          let strange = values.strangertemperature === true ? 1 : 0;
          let repeated = values.repeatedtemperature === true ? 1 : 0;
          formData.append("enable", ena);
          formData.append("warningTemperature", this.checkMaxAndMin(values.warningTemp,30,40));
          formData.append("mode", strange);
          formData.append("voiceMode", voice);
          formData.append("retry", repeated);
          formData.append("repeatInterval", this.checkMaxAndMin(values.interval,2,8));
          formData.append("delay", this.checkMaxAndMin(values.delay,0,9999))
          let data = {
            enable: values.switchOpen === true ? 1 : 0,
            voiceMode: values.voicebroadcastopen === true ? 1 : 0,
            mode: values.strangertemperature === true ? 1 : 0,
            warningTemperature: values.warningTemp,
            retry: values.repeatedtemperature === true ? 1 : 0,
            repeatInterval: values.interval,
            delay:values.delay
          };
          this.$axios.post("setTemperatureInfo", formData).then((res) => {
            this.submitLoading = false;
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(this.$t("warmthSettings.settingOk"));
              this.getdefaultMsg();
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },

    // 获取默认数据
    getdefaultMsg() {
      const _this = this;
      this.$axios.get("getTemperatureInfo").then((res) => {
        if (res.data.retCode === 0) {
          this.stranger = res.data.info.mode === 1;
          _this.form.setFieldsValue({
            switchOpen: res.data.info.enable === 1,
            voicebroadcastopen: res.data.info.voiceMode === 1,
            warningTemp: res.data.info.warningTemperature,
            strangertemperature: res.data.info.mode === 1,
            repeatedtemperature: res.data.info.retry === 1,
            interval: res.data.info.repeatInterval,
            delay:res.data.info.delay
          });
          //存陌生人测温开关是否打开 用来设置启用韦根
          if(res.data.info.enable===1){

                 if(res.data.info.mode===1){
          this.common= 1;
         }else{this.common= 0;}
          }else{this.common=0}
        localStorage.setItem('common',this.common)
        }
      });
    },

// input-number限制
    limit(value) {
      const reg = /^(\-)*(\d+)\.(\d).*$/;
      if (typeof value === "string") {
        return !isNaN(Number(value)) ? value.replace(reg, "$1$2.$3") : "";
      } else if (typeof value === "number") {
        return !isNaN(value) ? String(value).replace(reg, "$1$2.$3") : "";
      } else {
        return "";
      }
    },
  },
};

</script>

<style lang="less" scoped>
.warmthSettings {
  padding: 40px 0 0 80px;
  color: #151515 !important;
  .delay.ant-input-number {
    width: 240px;
  }
  .ant-input-number {
    width: 100%;
    position: relative;
    border-radius: 2px;
  }
  .after-suffix {
    content: "℃ 及以上";
    position: absolute;
    top: -5px;
    right: 9px;
    color: #b1b1b1;
    font-size: 14px;
    line-height: 30px;
  }
  .after {
    content: "秒";
    position: absolute;
    top: -5px;
    right: 9px;
    color: #b1b1b1;
    font-size: 14px;
    line-height: 30px;
  }
  .strag {
    display: flex;
  }
  .txt {
    font-size: 10px;
    color: #b1b1b1;
    margin-top: 2px;
  }
}
</style>
