<template>
<!-- 识别设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="recognize-settings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <a-form-item :label="fcThresholdLabel" class="toRight bottom24">
        <a-input-number
          :min="0"
          :max="1"
          :step="0.01"
          :precision="2"
          v-decorator="[
            'fcThreshold',
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
          :placeholder="fcThresholdPlaceholder"
        />
      </a-form-item>
      <a-form-item :label="failIntervalLabel" class="toRight bottom24">
        <a-input-number
          :min="1"
          :max="10"
          :step="0.01"
          :precision="2"
          class="after-suffix"
          v-decorator="[
            'failInterval',
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
      </a-form-item>
      <a-form-item :label="successRetry" class="success toRight bottom24">
        <a-switch
          class="switch"
          v-decorator="['successRetry', { valuePropName: 'checked' }]"
        />
      </a-form-item>
      <a-form-item class="successInterval toRight">
        <a-input-number
          :min="1"
          :max="10"
          :step="0.01"
          :precision="2"
          :disabled="successIntervalDisabled"
          class="after-suffix"
          v-decorator="[
            'successInterval',
            {
              rules: [{ validator: successIntervalValidator }],
              validateTrigger: 'blur',
            },
          ]"
        />
      </a-form-item>
      <!-- 活体检测 -->
      <a-form-item :label="liveModeLabel" class="bottom24">
        <a-switch
          class="switch"
          v-decorator="['liveMode', { valuePropName: 'checked' }]"
        />
      </a-form-item>
      <!-- 活体检测方式 -->
      <a-form-item
        :label="liveModeMethodLabel"
        class="toRight radioLabel toRadio bottom24"
      >
        <a-radio-group
          :disabled="methodsDisabled"
          v-decorator="[
            'liveModeMethod',
            {
              rules: [{ validator: livingBodyMethod }],
            },
          ]"
        >
          <a-radio :value="1"> RGB </a-radio>
          <a-radio :value="2">
            {{ $t("recognizeSettings.IRliveModeMethod") }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="irThresholdLabel" class="toRight bottom24">
        <a-input-number
          :min="0"
          :max="1"
          :step="0.01"
          :precision="2"
          :disabled="methodsDisabled === false ? IRDeisabled : true"
          v-decorator="[
            'irThreshold',
            {
              rules: [{ validator: livingValueRange }],
              validateTrigger: 'blur',
            },
          ]"
          :placeholder="irThresholdPlaceholder"
        />
      </a-form-item>
      <a-form-item :label="fqThresholdLabel" class="toRight bottom24">
        <a-input-number
          :min="0"
          :max="1"
          :step="0.01"
          :precision="2"
          v-decorator="[
            'fqThreshold',
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
          :placeholder="fqThresholdPlaceholder"
        />
      </a-form-item>
      <a-form-item label=" " :colon="false" class="top64">
        <a-button
          class="btn"
          type="primary"
          html-type="submit"
          :loading="submitLoading"
        >
          {{ $t("recognizeSettings.save") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      submitLoading: false,
      downIcon: <span class="iconfont iconziyuan4"></span>,
      successIntervalDisabled: false,
      methodsDisabled: true,
      IRDeisabled: true,
    };
  },
  computed: {
    requireMessage: function () {
      return this.$t("recognizeSettings.required");
    },
    fcThresholdLabel: function () {
      return this.$t("recognizeSettings.fcThresholdLabel");
    },
    fcThresholdPlaceholder: function () {
      return this.$t("recognizeSettings.fcThresholdPlaceholder");
    },
    failIntervalLabel: function () {
      return this.$t("recognizeSettings.failIntervalLabel");
    },
    successRetry: function () {
      return this.$t("recognizeSettings.successRetry");
    },
    liveModeLabel: function () {
      return this.$t("recognizeSettings.liveModeLabel");
    },
    liveModeMethodLabel: function () {
      return this.$t("recognizeSettings.liveModeMethodLabel");
    },
    IRliveModeMethod: function () {
      return this.$t("recognizeSettings.IRliveModeMethod");
    },
    irThresholdLabel: function () {
      return this.$t("recognizeSettings.irThresholdLabel");
    },
    irThresholdPlaceholder: function () {
      return this.$t("recognizeSettings.irThresholdPlaceholder");
    },
    fqThresholdLabel: function () {
      return this.$t("recognizeSettings.fqThresholdLabel");
    },
    fqThresholdPlaceholder: function () {
      return this.$t("recognizeSettings.fqThresholdPlaceholder");
    },
  },
  // 创建之前监听表单
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "recognizeSettings",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("successRetry")) {
          this.successIntervalDisabled = !values.successRetry;
        }
        if (values.hasOwnProperty("liveMode")) {
          if (!values.liveMode) {
            this.form.setFieldsValue({
              method: null,
              // IRWindow: true,
              livingRange: null,
            });
          }
          this.methodsDisabled = !values.liveMode;
        }
        if (values.hasOwnProperty("liveModeMethod")) {
          this.IRDeisabled = values.liveModeMethod !== 2;
        }
      },
    });
  },
  mounted() {
    this.getdefaultMsg();
  },
  methods: {
    // 校验规则
    livingBodyMethod(rule, value, callback) {
      if (!this.methodsDisabled) {
        if (!value) {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 活体校验
    livingValueRange(rule, value, callback) {
      if (!this.IRDeisabled) {
        if (value === "") {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 成功校验
    successIntervalValidator(rule, value, callback) {
      if (!this.successIntervalDisabled) {
        if (!value) {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 按钮改变事件
    checkRadio(val){
      let newVal = -1;
      if(Number(val) === 1 || Number(val) === 2){
        newVal = val
      }else{
        newVal = 2
      }
      return newVal;
    },
    // 获取接口数据
    getdefaultMsg() {
      const _this = this;
      this.$axios.get("getRecognizeInfo").then((res) => {
        if (res.data.retCode === 0) {
          _this.form.setFieldsValue({
            fcThreshold: res.data.info.fcThreshold,
            failInterval: res.data.info.failInterval,
            successRetry: res.data.info.successRetry ? true : false,
            successInterval: res.data.info.successInterval,
            liveMode: res.data.info.liveMode === 0 ? false : true,
            liveModeMethod:
              res.data.info.liveMode !== 0 ? this.checkRadio(res.data.info.liveMode) : 2,
            irThreshold: res.data.info.irThreshold,
            fqThreshold: res.data.info.fqThreshold,
          });
        }
      });
    },
    // 校验字符串
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
    // 提交事件
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true;
          let formData = new FormData();
          formData.append("fcThreshold", this.checkMaxAndMin(values.fcThreshold,0,1));
          formData.append("failInterval", this.checkMaxAndMin(values.failInterval,1,10));
          formData.append("successRetry", values.successRetry ? 1 : 0);
          formData.append("successInterval", this.checkMaxAndMin(values.successInterval,1,10));
          if (!values.liveMode) {
            formData.append("liveMode", 0);
          } else if (values.liveModeMethod === 1) {
            formData.append("liveMode", 1);
          } else {
            formData.append("liveMode", 2);
          }
          formData.append("irThreshold", this.checkMaxAndMin(values.irThreshold,0,1));
          formData.append("fqThreshold", this.checkMaxAndMin(values.fqThreshold,0,1));
          this.$axios.post("setRecognizeInfo", formData).then((res) => {
            this.submitLoading = false;
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(this.$t("recognizeSettings.settingOk"));
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.recognize-settings {
  padding: 40px 0 0 80px;
  color: #151515 !important;
  .success .ant-input-affix-wrapper {
    width: 176px !important;
  }
  .btn {
    width: 80px !important;
  }
  .successInterval.ant-row.ant-form-item {
    position: absolute !important;
    top: 150px;
    left: 286px;
  }
  .ant-input-number {
    width: 100%;
    position: relative;
    border-radius: 2px;
  }
  .ant-input-number.after-suffix::after {
    content: "秒";
    position: absolute;
    top: 0;
    right: 9px;
    color: #b1b1b1;
    font-size: 14px;
    line-height: 30px;
  }
}
.en .recognize-settings .successInterval.ant-row.ant-form-item {
  left: 385px !important;
}
</style>
