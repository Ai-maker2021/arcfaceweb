<template>
<!-- 测温模组 -->
  <div class="box">
    <a-form
      labelAlign="left"
      class="recognize-settings"
      :form="form"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <a-form-item>
        <a-checkbox
          style="zoom: 130%"
          v-decorator="[
            'serialport',
            {
              valuePropName: 'checked',
            },
          ]"
        >
          {{ $t("TemperatureModuleSettings.serialport") }}
        </a-checkbox>
      </a-form-item>

      <a-form-item :label="serialaddressLabel" class="toRight bottom24">
        <a-input
          :disabled="Disabled"
          v-decorator="[
            'serialaddress',
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

      <a-form-item :label="BPSLabel" class="bottom24">
        <a-select
          :disabled="Disabled"
          :suffixIcon="downIcon"
          v-decorator="[
            'BPS',
            {
              validateTrigger: 'blur',
            },
          ]"
        >
          <a-select-option value="110">110</a-select-option>
          <a-select-option value="300">300</a-select-option>
          <a-select-option value="600">600</a-select-option>
          <a-select-option value="1200">1200</a-select-option>
          <a-select-option value="2400">2400</a-select-option>
          <a-select-option value="4800">4800</a-select-option>
          <a-select-option value="9600">9600</a-select-option>
          <a-select-option value="14400"> 14400 </a-select-option>
          <a-select-option value="19200"> 19200 </a-select-option>
          <a-select-option value="38400"> 38400</a-select-option>
          <a-select-option value="56000"> 56000</a-select-option>
          <a-select-option value="57600">57600</a-select-option>
          <a-select-option value="115200">115200</a-select-option>
          <a-select-option value="921600">921600</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
          style="margin-left: 145px; border-radius: 2px; margin-top: 50px"
        >
          {{ $t("TemperatureModuleSettings.save") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "temperaturemodule",
  data() {
    return {
      downIcon: <span class="iconfont iconziyuan4"></span>,
      Disabled: false,
    };
  },
  computed: {
    serialaddressLabel: function () {
      return this.$t("TemperatureModuleSettings.serialaddressLabel");
    },
    BPSLabel: function () {
      return this.$t("TemperatureModuleSettings.BPSLabel");
    },
    requireMessage: function () {
      return this.$t("TemperatureModuleSettings.required");
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "temperaturemodule",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("serialport")) {
          this.Disabled = !values.serialport;
        }
      },
    });
  },
  mounted() {
    this.getdefaultMsg();
  },
  methods: {
    // 提交事件
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          let type = values.serialport === true ? 1 : 0;
          let serialPortPath = values.serialaddress;
          let baudrate = values.BPS;
          formData.append("type", type);
          formData.append("serialPortPath", serialPortPath);
          formData.append("baudrate", baudrate);
          this.$axios.post("setPeripheralsSetting", formData).then((res) => {
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(
                this.$t("TemperatureModuleSettings.settingOk")
              );
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
      this.$axios.get("getPeripheralsSetting").then((res) => {
        if (res.data.retCode === 0) {
          _this.form.setFieldsValue({
            serialport: res.data.info.type === 1,
            serialaddress: res.data.info.serialPortPath,
            BPS: res.data.info.baudrate,
          });
        }
      });
    },
  },
};
</script>
<style scoped="scoped">
.box {
  margin-left: 80px;
  margin-top: 40px;
}
</style>