<template>
<!-- 门禁机设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="access-settings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <a-form-item :label="connectState" class="linkStatus bottom24">
        <span v-if="oneshow">
          <span class="ant-form-text">
            {{ $t("accessSettings.standAlone") }}
          </span>
          <i class="iconfont iconduankailianjie"></i>
        </span>
        <span v-if="twoshow" class="blue" @click="showbindConfirm">
          <span class="ant-form-text">
            {{ $t("accessSettings.managementendIP") }} {{ managerIp }}
          </span>
          <i class="iconfont iconduankailianjie"></i>
        </span>
      </a-form-item>
      <a-form-item :label="deviceNameLabel" class="toRight bottom24">
        <a-input
          v-decorator="[
            'deviceName',
            {
              rules: [
                {
                  required: true,
                  message: requireMessage
                }
              ],
              validateTrigger: 'blur'
            }
          ]"
          :placeholder="deviceNamePlaceholder"
          :maxLength="30"
        />
      </a-form-item>
      <a-form-item :label="restartLabel" class="restart toRight bottom24">
        <a-switch
          class="switch"
          v-decorator="[
            'reboot',
            {
              valuePropName: 'checked'
            }
          ]"
        />
      </a-form-item>
      <a-form-item class="time toRight">
        <a-time-picker
          :disabled="timeDisabled"
          class="time-picker"
          :placeholder="timePlaceholder"
          v-decorator="['rebootTime', config]"
        />
      </a-form-item>
      <a-form-item :label="delayLabel" class="toRight bottom24">
        <a-input-number
          :min="2"
          :max="100"
          :precision="2"
          class="after-suffix"
          v-decorator="[
            'closeDoorInterval',
            {
              rules: [
                {
                  required: true,
                  message: requireMessage
                }
              ],
              validateTrigger: 'blur'
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="IP" class="IP bottom24">
        <span class="ant-form-text">
          {{ ip }}
        </span>
      </a-form-item>
      <a-form-item label="MAC" class="MAC bottom24">
        <span class="ant-form-text">
          {{ mac }}
        </span>
      </a-form-item>
      <a-form-item :label="CPULabel" class="SN bottom24">
        <span class="ant-form-text">
          {{ cpuserial }}
        </span>
      </a-form-item>
      <!-- 端口号 -->
      <a-form-item :label="portLabel" class="toRight bottom24">
        <a-input disabled v-decorator="['port']" />
        <!-- :maxLength="15" -->
      </a-form-item>
      <!-- 上传识别记录图片 -->
      <a-form-item :label="uploadLabel" class="strag" v-if="aflag">
        <a-switch v-model="uploadOpen" />
        <p class="Tooltiptext">{{ $t("accessSettings.Tooltiptext") }}</p>
      </a-form-item>
      <a-form-item :label="versionLabel" class="version bottom24">
        <span class="ant-form-text version-item">
          ArcFaceGo： {{ $store.state.arcFaceGoversion }}
        </span>
        <br />
        <span class="ant-form-text version-item">
          ArcFaceServer： {{ $store.state.arcFaceServerVersion }}
        </span>
      </a-form-item>
      <a-form-item
        label=" "
        :colon="false"
        class="top64"
        style="margin-top:36px"
      >
        <a-button
          style="margin-bottom:130px"
          class="btn"
          type="primary"
          html-type="submit"
          :loading="submitLoading"
        >
          {{ $t("accessSettings.save") }}
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal
      :title="remindTitle"
      :visible="reseting"
      :centered="true"
      :closable="false"
      :width="290"
      :footer="null"
    >
      <div class="content">
        <p>{{ $t("accessSettings.restoring") }}</p>
      </div>
    </a-modal>
    <!-- 提示信息modal -->
    <a-modal
      :title="remindTitle"
      :visible="dialogIsShow"
      :centered="true"
      :closable="false"
      :width="380"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handlebindOk"
          class="modal-submit"
        >
          {{ this.$t("accessSettings.confirm") }}
        </a-button>
        <a-button key="back" @click="handlebindCancel" class="modal-cancel">
          {{ this.$t("accessSettings.cancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <p>{{ this.$t("accessSettings.bindConfirm") }}</p>
        <p>{{ $t("accessSettings.managementendIP") }} {{ this.managerIp }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "accessSettings",
  data() {
    return {
      submitLoading: false,
      restoreLoading: false,
      resetConfirm: false,
      dialogIsShow: false,
      oneshow: false,
      twoshow: false,
      aflag: false,
      threeshow: false,
      uploadOpen: false,
      reseting: false,
      config: {
        rules: [{ type: "object" }, { validator: this.timeValidator }]
      },
      timeDisabled: false,
      ip: "",
      managerIp: "",
      mac: "",
      cpuserial: "",
      ArcFaceGoversion: "",
      ArcFaceServerversion: "",
      connectionType: ""
    };
  },
  computed: {
    portLabel: function() {
      return this.$t("accessSettings.portLabel");
    },
    uploadLabel: function() {
      return this.$t("accessSettings.uploadLabel");
    },
    CPULabel: function() {
      return this.$t("basicSettings.CPULabel");
    },
    connectState: function() {
      return this.$t("accessSettings.connectState");
    },
    deviceNameLabel: function() {
      return this.$t("accessSettings.deviceName");
    },
    requireMessage: function() {
      return this.$t("accessSettings.required");
    },
    deviceNamePlaceholder: function() {
      return this.$t("accessSettings.deviceNamePlaceholder");
    },
    restartLabel: function() {
      return this.$t("accessSettings.restartLabel");
    },
    timePlaceholder: function() {
      return this.$t("accessSettings.timePlaceholder");
    },
    delayLabel: function() {
      return this.$t("accessSettings.delayLabel");
    },
    restoreLabel: function() {
      return this.$t("accessSettings.restoreLabel");
    },
    versionLabel: function() {
      return this.$t("accessSettings.versionLabel");
    },
    remindTitle: function() {
      return this.$t("accessSettings.remind");
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "accessSettings"
    });
  },
  mounted() {
    this.getdefaultMsg();
  },
  methods: {
    // 确认开关
    showbindConfirm() {
      this.dialogIsShow = true;
    },
    // 取消事件
    handlebindCancel() {
      this.dialogIsShow = false;
    },
    // 绑定成功
    handlebindOk() {
      this.dialogIsShow = false;
      this.$axios.get("deviceDisconnect").then(res => {
        if (res.data.retCode === 0) {
          this.$message.destroy();
          this.$message.success(this.$t("accessSettings.unbindOk"));
          window.location.reload(true);
        } else {
          this.$message.destroy();
          this.$message.error(res.data.retMsg);
        }
      });
    },
    // 校验时间
    isTime(str) {
      let a = str && str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
      if (a == null) {
        return false;
      }
      if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
        return false;
      }
      return true;
    },
    // 校验传给接口的字符串长度
    checkStrLength(str, max) {
      let newStr = str && String(str).trim();
      let val = "";
      if (newStr && newStr.length > max) {
        val = newStr.substr(0, max);
      } else if (newStr && newStr.length === 0) {
        val = "";
      } else {
        val = newStr.trim();
      }
      return val;
    },
    // 获取默认数据
    async getdefaultMsg() {
      const _this = this;
      this.$axios.get("getDeviceInfo").then(res => {
        if (res.data.retCode === 0) {
          _this.form.setFieldsValue({
            deviceName: this.checkStrLength(res.data.info.deviceName,30),
            reboot: res.data.info.reboot !== 0 ? true : false,
            port: res.data.info.clientPort,
            rebootTime: this.isTime(res.data.info.rebootTime)
              ? moment(res.data.info.rebootTime, "HH:mm:ss")
              : moment("04:30:00", "HH:mm:ss"),
            closeDoorInterval: res.data.info.closeDoorInterval
          });
          this.type = res.data.info.connectionType;
          if (this.type == 1) {
            this.oneshow = true;
          } else if (this.type == 2) {
            this.twoshow = true;
            this.aflag = true;
            this.managerIp = res.data.info.managerIp;
            this.uploadOpen =
              res.data.info.uploadRecordImage == 1 ? true : false;
          }
          _this.ip = res.data.info.ip;
          _this.mac = res.data.info.mac;
          _this.cpuserial = res.data.info.cpuserial;
        }
      });
    },
    // 校验传给接口的字段是否在规定范围内
    checkMaxAndMin(num, min, max) {
      let val = 0;
      if (Number(num) > max) {
        val = max;
      } else if (Number(num) < min) {
        val = min;
      } else {
        val = Number(num);
      }
      return val;
    },

    // 提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true;
          let formData = new FormData();
          formData.append(
            "deviceName",
            this.checkStrLength(values.deviceName.trim(), 30)
          );
          formData.append("reboot", values.reboot ? 1 : 0);
          formData.append(
            "rebootTime",
            moment(values.rebootTime).format("HH:mm:ss")
          );
          formData.append(
            "closeDoorInterval",
            this.checkMaxAndMin(values.closeDoorInterval, 2, 100)
          );
          formData.append("clientPort", values.port);
          if (this.type == 2) {
            //是否上传识别记录图片
            let ena = this.uploadOpen === true ? 1 : 0;
            formData.append("uploadRecordImage", ena);
          }
          this.$axios.post("setDeviceInfo", formData).then(res => {
            this.submitLoading = false;
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(this.$t("accessSettings.settingOk"));
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },
    // 校验表单
    timeValidator(rule, value, callback) {
      // 根据disabled判断是否校验
      if (!this.timeDisabled) {
        if (value == null) {
          callback(this.$t("accessSettings.required"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 重置开关控制
    showResetConfirm() {
      this.resetConfirm = true;
    },
    handleResetCancel() {
      this.resetConfirm = false;
    },

    // 点击确认重置
    handleResetOk() {
      this.resetConfirm = false;
      this.reseting = true;
      const _this = this;
      // 重置应用
      this.$axios.get("resetSoftware", "", { timeout: 30000 }).then(res => {
        if (res.data.retMsg === "timeout") {
          _this.reseting = false;
        }
        if (res.data.retCode === 0) {
          _this.reseting = false;
          setTimeout(() => {
            this.$router.push("/firstLogin");
          }, 2000);
        }
      });
    },


    // 获取版本号
    async getVersion() {
      this.$axios.get("getVersion").then(res => {
        if (res.data.retCode === 0) {
          this.ArcFaceGoversion = res.data.info.ArcFaceGoVersion;
          this.ArcFaceServerversion = res.data.info.ArcFaceServerVersion;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.access-settings {
  padding: 40px 0 0 80px;
  color: #151515 !important;
  .blue {
    .iconfont {
      color: #007aff !important;
    }
  }
  .Tooltiptext {
    font-size: 10px;
    color: #b1b1b1;
    margin-top: 2px;
  }
  .strag {
    display: flex;
  }
  .time-picker {
    width: 176px;
  }
  .restoreBtn {
    border-radius: 2px;
    color: #007aff !important;
    background-color: #fff !important;
  }
  .restoreBtn:hover {
    color: #fff !important;
    background-color: #007aff !important;
  }
  .btn {
    width: 80px !important;
  }
  .time.ant-row.ant-form-item {
    position: absolute !important;
    top: 150px;
    left: 307px;
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
  .version-item {
    margin-bottom: 4px;
  }
}
.content {
  text-align: center !important;
  margin-bottom: 24px;
  .iconfont {
    margin-right: 8px;
    color: #ffb100;
    font-size: 24px;
  }
}
// .iconfont .iconduankailianjie{
//    color: #0051ff;
// }
.en .access-settings .time.ant-row.ant-form-item {
  left: 411px;
}
</style>
