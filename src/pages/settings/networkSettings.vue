<template>
<!-- 网络设置 -->
  <div class="network">
    <a-form
      labelAlign="left"
      :form="formTop"
      class="networkSettingsTop"
      @submit="handleSubmitTop"
      :hideRequiredMark="true"
    >
      <title-bar :title="'LAN'" />
      <div class="formContent">
        <a-form-item :label="LANautoGetLabel" class="bottom24">
          <a-switch
            class="switch"
            v-decorator="[
              'LANAutoGet',
              {
                valuePropName: 'checked',
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="LANIpv4Label" class="toRight bottom24 inlineBlock">
          <a-input
            :disabled="lanDisabled"
            v-decorator="[
              'LANIpv4',
              {
                rules: [
                  {
                    validator: lanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="lanMacLabel" class="toRight bottom24 inlineBlock">
          <span>
            {{ lanMac }}
          </span>
        </a-form-item>
        <a-form-item :label="LANMaskLabel" class="toRight bottom24 inlineBlock">
          <a-input
            :disabled="lanDisabled"
            v-decorator="[
              'LANMask',
              {
                rules: [
                  {
                    validator: lanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="LANFirstDNS" class="toRight bottom24 inlineBlock">
          <a-input
            :disabled="lanDisabled"
            v-decorator="[
              'LANFirstDNS',
              {
                rules: [
                  {
                    validator: lanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="LANGatewayLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="lanDisabled"
            v-decorator="[
              'LANGateway',
              {
                rules: [
                  {
                    validator: lanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="LANSpareDNSLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="lanDisabled"
            v-decorator="[
              'LANSpareDNS',
              {
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item label=" " :colon="false" class="top64">
          <a-button
            class="btn"
            type="primary"
            html-type="submit"
            :loading="submitLoadingTop"
          >
            {{ $t("networkSettings.lanSave") }}
          </a-button>
        </a-form-item>
      </div>
    </a-form>
    <title-bar :title="'WLAN'" />
    <!-- 底部form -->
    <a-form
      labelAlign="left"
      :form="formBottom"
      class="networkSettingsBottom"
      @submit="handleSubmitBottom"
      :hideRequiredMark="true"
    >
      <div class="formContent">
        <a-form-item :label="WLANAutoGetLabel" class="bottom24">
          <a-switch
            class="switch"
            v-decorator="[
              'WLANAutoGet',
              {
                valuePropName: 'checked',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="WLANIpv4Label"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="wlanDisabled"
            v-decorator="[
              'WLANIpv4',
              {
                rules: [
                  {
                    validator: wlanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="wlanMacLabel" class="toRight bottom24 inlineBlock">
          <span>
            {{ wlanMac }}
          </span>
        </a-form-item>
        <a-form-item
          :label="WLANMaskLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="wlanDisabled"
            v-decorator="[
              'WLANMask',
              {
                rules: [
                  {
                    validator: wlanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="WLANFirstDNSLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="wlanDisabled"
            v-decorator="[
              'WLANFirstDNS',
              {
                rules: [
                  {
                    validator: wlanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="WLANGatewayLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="wlanDisabled"
            v-decorator="[
              'WLANGateway',
              {
                rules: [
                  {
                    validator: wlanValidator,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="WLANSpareDNSLabel"
          class="toRight bottom24 inlineBlock"
        >
          <a-input
            :disabled="wlanDisabled"
            v-decorator="[
              'WLANSpareDNS',
              {
                validateTrigger: 'blur',
              },
            ]"
          />
        </a-form-item>
        <a-form-item label=" " :colon="false" class="top64">
          <a-button
            class="btn"
            type="primary"
            html-type="submit"
            :loading="submitLoadingBottom"
          >
            {{ $t("networkSettings.wlanSave") }}
          </a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import TitleBar from "./childComponents/titleBar";

export default {
  name: "networkSettings",
  beforeCreate() {
    this.formTop = this.$form.createForm(this, {
      name: "networkSettingsTop",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("LANAutoGet")) {
          this.lanDisabled = values.LANAutoGet;
        }
      },
    });
    this.formBottom = this.$form.createForm(this, {
      name: "networkSettingsBottom",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("WLANAutoGet")) {
          this.wlanDisabled = values.WLANAutoGet;
        }
      },
    });
  },
  components: {
    TitleBar,
  },
  data() {
    return {
      lanDisabled: false,
      LANAutoGet: true,
      wlanDisabled: false,
      submitLoadingTop: false,
      submitLoadingBottom: false,
      lanMac: "",
      wlanMac: "",
      rep: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/,
    };
  },
  computed: {
    LANautoGetLabel: function () {
      return this.$t("networkSettings.LANautoGetLabel");
    },
    LANIpv4Label: function () {
      return this.$t("networkSettings.LANIpv4Label");
    },
    lanMacLabel: function () {
      return this.$t("networkSettings.lanMacLabel");
    },
    LANMaskLabel: function () {
      return this.$t("networkSettings.LANMaskLabel");
    },
    LANFirstDNS: function () {
      return this.$t("networkSettings.LANFirstDNS");
    },
    LANGatewayLabel: function () {
      return this.$t("networkSettings.LANGatewayLabel");
    },
    LANSpareDNSLabel: function () {
      return this.$t("networkSettings.LANSpareDNSLabel");
    },
    WLANAutoGetLabel: function () {
      return this.$t("networkSettings.WLANAutoGetLabel");
    },
    WLANIpv4Label: function () {
      return this.$t("networkSettings.WLANIpv4Label");
    },
    wlanMacLabel: function () {
      return this.$t("networkSettings.wlanMacLabel");
    },
    WLANMaskLabel: function () {
      return this.$t("networkSettings.WLANMaskLabel");
    },
    WLANFirstDNSLabel: function () {
      return this.$t("networkSettings.WLANFirstDNSLabel");
    },
    WLANGatewayLabel: function () {
      return this.$t("networkSettings.WLANGatewayLabel");
    },
    WLANSpareDNSLabel: function () {
      return this.$t("networkSettings.WLANSpareDNSLabel");
    },
  },
  mounted() {
    this.getdefaultMsg();
  },
  methods: {
    // 根据disabled判断是否校验
    lanValidator(rule, value, callback) {
      if (!this.lanDisabled) {
      } else {
        callback();
      }
      if (!value) {
        callback(this.$t("networkSettings.required"));
      } else if (value && !this.rep.test(value)) {
        callback(this.$t("networkSettings.patternWrong"));
      } else {
        callback();
      }
    },
    // 表单校验
    wlanValidator(rule, value, callback) {
      if (!this.wlanDisabled) {
      } else {
        callback();
      }
      if (!value) {
        callback(this.$t("networkSettings.required"));
      } else if (value && !this.rep.test(value)) {
        callback(this.$t("networkSettings.patternWrong"));
      } else {
        callback();
      }
    },
    // 保存LAN
    handleSubmitTop(e) {
      e.preventDefault();
      this.formTop.validateFields((err, values) => {
        if (!err) {
          this.submitLoadingTop = true;
          let data = {
            LAN: {
              dns1: values.LANFirstDNS,
              dns2: values.LANSpareDNS,
              gateway: values.LANGateway,
              ipv4: values.LANIpv4,
              mac: values.lanMac,
              method: values.LANAutoGet === true ? 1 : 0,
              netmask: values.LANMask,
            },
          };
          this.$axios.patch("setNetworkInfo", data).then((res) => {
            this.submitLoadingTop = false;
            if (res.data.retCode === 0) {
              this.submitLoadingTop = false;
              this.$message.destroy();
              this.$message.success(this.$t("networkSettings.settingOk"));
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },
    // 保存WLAN
    handleSubmitBottom(e) {
      e.preventDefault();
      this.formBottom.validateFields((err, values) => {
        if (!err) {
          this.submitLoadingBottom = true;
          let data = {
            WLAN: {
              dns1: values.WLANFirstDNS,
              dns2: values.WLANSpareDNS,
              gateway: values.WLANGateway,
              ipv4: values.WLANIpv4,
              mac: values.wlanMac,
              method: values.WLANAutoGet === true ? 1 : 0,
              netmask: values.WLANMask,
            },
          };
          this.$axios.patch("setNetworkInfo", data).then((res) => {
            this.submitLoadingBottom = false;
            if (res.data.retCode === 0) {
              this.submitLoadingBottom = false;
              this.$message.destroy();
              this.$message.success(this.$t("networkSettings.settingOk"));
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
      this.$axios.get("getNetworkInfo").then((res) => {
        if (res.data.retCode === 0) {
          let info = res.data.info;
          _this.formTop.setFieldsValue({
            LANIpv4: info.LAN.ipv4,
            LANFirstDNS: info.LAN.dns1,
            LANGateway: info.LAN.gateway,
            LANSpareDNS: info.LAN.dns2,
            LANMask: info.LAN.netmask,
            LANAutoGet: info.LAN.method === 0 ? false : true,
          });
          _this.formBottom.setFieldsValue({
            WLANIpv4: info.WLAN.ipv4,
            WLANFirstDNS: info.WLAN.dns1,
            WLANGateway: info.WLAN.gateway,
            WLANSpareDNS: info.WLAN.dns2,
            WLANMask: info.WLAN.netmask,
            WLANAutoGet: info.WLAN.method === 0 ? false : true,
          });
          _this.lanMac = info.LAN.mac;
          _this.wlanMac = info.WLAN.mac;
          _this.lanDisabled = info.LAN.method === 0 ? false : true;
          _this.wlanDisabled = info.WLAN.method === 0 ? false : true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.network {
  padding: 24px;
  .formContent {
    padding: 16px 0px 16px 56px;
    .toRight.bottom24.inlineBlock.ant-row.ant-form-item:nth-child(2n) {
      margin-right: 120px;
    }
  }
  .inlineBlock {
    display: inline-block;
  }
  .btn {
    width: 80px !important;
  }
}
</style>
