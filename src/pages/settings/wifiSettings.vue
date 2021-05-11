<template>
<!-- WiFi设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="wifiSettings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <a-form-item :label="openWifiLabel" class="bottom24">
        <a-switch
          class="switch"
          @change="toggleOpen"
          v-decorator="[
            'openWifi',
            {
              valuePropName: 'checked'
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="wifiListLabel" class="bottom24">
        <a-button
          class="setBtn"
          :disabled="wifiDisabled"
          @click="scanWifi"
          :loading="connectLoading"
          >{{ $t("wifiSettings.scan") }}</a-button
        >
      </a-form-item>
      <div class="loading scanWifi" v-if="scanLoading">
        <a-spin :tip="spinTip" size="large" />
      </div>
      <a-table
        v-else
        class="scanWifi"
        :columns="columns"
        :data-source="wifiList"
        :pagination="false"
        tableLayout="fixed"
        :row-key="rowKey"
        align="center"
        :rowClassName="setRowClassName"
        :customRow="rowClick"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
      <a-form-item :label="WIFINameLabel" class="toRight bottom24">
        <a-input
          :disabled="wifiDisabled || nameDisabled"
          v-decorator="[
            'WIFIName',
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
          :maxLength="50"
        />
      </a-form-item>
      <a-form-item :label="WIFIPasswordLabel" class="toRight bottom24">
        <a-input-password
          :disabled="wifiDisabled"
          v-decorator="[
            'WIFIPassword',
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
          :maxLength="50"
        />
      </a-form-item>
      <div v-if="showTip" class="showTip">
        {{ $t("wifiSettings.connectedTip") }}
      </div>
      <a-form-item label=" " :colon="false" class="top64">
        <a-button
          :disabled="wifiDisabled"
          class="btn"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ $t("wifiSettings.connect") }}
        </a-button>
        <a-button
          class="deleteBtn"
          :loading="deleteLoading"
          :disabled="wifiDisabled"
          @click="handleDelete"
        >
          {{ $t("wifiSettings.delete") }}
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal
      :title="deleteTitle"
      :visible="deleteComfirm"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          :loading="confirmLoading"
          @click="handleDeleteOk"
          class="modal-submit"
        >
          {{ $t("wifiSettings.confirm") }}
        </a-button>
        <a-button
          key="back"
          @click="handleDeleteCancel"
          class="modal-cancel"
          :disabled="confirmLoading"
        >
          {{ $t("wifiSettings.cancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div class="p1">{{ $t("wifiSettings.deleteTip") }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "wifiSettings",
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "wifiSettings"
    });
  },
  data() {
    return {
      submitLoading: false,
      scanLoading: false,
      deleteLoading: false,
      wifiList: [],
      wifiDisabled: false,
      autoDisabled: false,
      linkLoading: false,

      nameDisabled: false,
      rowId: null,
      linkedName: "",
      linkedPassword: "",
      errIds: [],
      linkingWifiName: "",
      linkWifiOldState: "",
      connectLoading: false,
      deleteComfirm: false,
      confirmLoading: false,
      showTip: false,
      wifiService: "",
      wifiState: "",
      outWifiName: ""
    };
  },
  computed: {
    columns: function() {
      return [
        {
          title: this.$t("wifiSettings.index"),
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: this.$t("wifiSettings.wifiname"),
          customRender: (text, record, index) => record.wifiName
        },
        {
          title: this.$t("wifiSettings.strength"),
          customRender: (text, record, index) => record.strength
        },
        {
          title: this.$t("wifiSettings.security"),
          customRender: (text, record, index) => record.security
        },
        {
          title: this.$t("wifiSettings.state"),
          customRender: (text, record, index) => record.state
        }
      ];
    },
    openWifiLabel: function() {
      return this.$t("wifiSettings.openWifiLabel");
    },
    wifiListLabel: function() {
      return this.$t("wifiSettings.wifiListLabel");
    },
    spinTip: function() {
      return this.$t("wifiSettings.spinTip");
    },
    WIFINameLabel: function() {
      return this.$t("wifiSettings.WIFINameLabel");
    },
    WIFIPasswordLabel: function() {
      return this.$t("wifiSettings.WIFIPasswordLabel");
    },
    deleteTitle: function() {
      return this.$t("wifiSettings.deleteTitle");
    },
    requireMessage: function() {
      return this.$t("wifiSettings.required");
    }
  },
  mounted() {
    this.scanWifi(true);
  },
  methods: {
    // 表格行 key 的取值，可以是字符串或一个函数
    rowKey(record, index) {
      return String(record.wifiName + Math.random());
    },
    // 删除wifi
    handleDelete() {
      this.deleteComfirm = true;
    },
    // 删除成功
    handleDeleteOk() {
      this.startTime = null;
      this.confirmLoading = true;
      this.showTip = false;
      let name = this.form.getFieldValue("WIFIName");
      this.$axios
        .patch("connectWifi", {
          enable: 0,
          wifiName: name
        })
        .then(res => {
          this.confirmLoading = false;
          this.deleteComfirm = false;
          setTimeout(() => {
            this.scanWifi();
          }, 1000);
          // 清空输入框
          this.form.setFieldsValue({
            WIFIName: "",
            WIFIPassword: ""
          });
        });
    },
    // 取消删除
    handleDeleteCancel() {
      this.deleteComfirm = false;
    },
    // 连接wifi
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.connectLoading = true;
          // 保存连接中的wifi名，状态
          this.linkingWifiName = values.WIFIName;
          this.wifiList.forEach(item => {
            if (item.wifiName === values.WIFIName) {
              this.linkWifiOldState = item.state;
            }
          });
          this.submitLoading = true;
          this.$axios
            .patch("connectWifi", {
              enable: 1,
              autoConnect: 1,
              wifiName: values.WIFIName,
              password: values.WIFIPassword
            })
            .then(res => {
              if (res.data.retCode === 0) {
                this.submitLoading = false;
                this.scanLoading = true;
                // 刷新wifi列表  wifi状态改变后，清楚定时器；超过10秒，清除定时器
                this.startTime = Date.now();
                this.timer = setInterval(async () => {
                  this.scanLoading = false;
                  await this.scanWifi(false, values.WIFIName);
                }, 3000);
              }
            });
        }
      });
    },
    toggleOpen(checked) {
      this.toggleWifi(checked);
    },

    // 切换开关
    toggleWifi(flag) {
      this.$nextTick(() => {
        let openWifi = this.form.getFieldValue("openWifi");
        let formData = new FormData();
        let e = flag || openWifi === true ? 1 : 0;
        formData.append("enable", e);
        this.$axios.post("enableWifi", formData).then(() => {
          if (flag) {
            this.scanLoading = true;
            // 打开后默认扫描wifi
            setTimeout(() => {
              this.scanWifi();
              this.scanLoading = false;
            }, 3000);
          } else {
            this.wifiList = [];
          }
        });
        this.wifiDisabled = !this.wifiDisabled;
      });
    },


    // 获取wifi列表
    scanWifi(flag = false, outWifiName = "") {
      this.nameDisabled = false;
      if (flag !== true) {
        this.scanLoading = true;
      }
      this.$axios
        .get("detectWifi")
        .then(res => {
          if (res.data.retCode === 0) {
            this.scanLoading = false;
            // 刚进来时的调用，不设置参数
            if (flag) {
              this.form.setFieldsValue({
                openWifi: res.data.info.wifiStatus === 1
              });
              this.wifiDisabled = !(res.data.info.wifiStatus === 1);
            }

            // 如果打开了
            if (!this.wifiDisabled) {
              let wifiService = res.data.info.wifiService;
              // 过滤无名wifi
              wifiService =
                wifiService && wifiService.filter(item => item.wifiName !== "");
                let successWifi = wifiService.filter(item => item.state === "ready");
              this.wifiList = wifiService;
              let service = this.wifiService || wifiService[0].service;
              let name = this.wifiName || wifiService[0].wifiName;
              this.$axios
                .patch("getCurWifiInfo", {
                  service: service
                })
                .then(res => {
                  if (res.data.retCode === 0) {
                    this.form.setFieldsValue({
                      WIFIName: name,
                      WIFIPassword: res.data.info.password
                    });
                    this.canScanLoading = res.data.info.autoConnect === 1;
                    // 输入框内 WiFi名是当前连接成功的WiFi才显示红色提示
                    this.showTip = successWifi.length >=1 &&
                      (name === successWifi[0].wifiName);
                  }
                });
              //  已经连接WiFi  再点击连接当前连接的 WiFi   就清除定时器
              if (
                this.linkingWifiName === outWifiName &&
                this.linkWifiOldState === "ready"
              ) {
                this.startTime = null;
                this.connectLoading = false;
                clearInterval(this.timer);
              }
              if (this.startTime && (Date.now() - this.startTime) > 10000) {
                this.startTime = null;
                this.connectLoading = false;
                clearInterval(this.timer);
                this.$message.destroy();
                this.$message.error(
                  outWifiName + this.$t("wifiSettings.connectFail")
                );
              } else {
                this.wifiList &&
                  this.wifiList.forEach(item => {
                    if (
                      item.wifiName === this.linkingWifiName &&
                      item.state != this.linkWifiOldState
                    ) {
                      this.startTime = null;
                      this.connectLoading = false;
                      clearInterval(this.timer);
                    }
                  });
              }
              this.rowId = null;
              this.errIds = [];
              // 记住有问题的wifi
              if (wifiService) {
                for (let i = 0; i < wifiService.length; i++) {
                  if (
                    wifiService[i].state !== "ready" &&
                    wifiService[i].state !== "idle"
                  ) {
                    this.errIds.push(i);
                  }
                }
              }
            }
          }
        })
        .catch(err => console.log(err, "===="));
    },
    autoChange(checked) {
      this.autoDisabled = checked;
    },

    // 把连接成功的那个WiFi名称作为默认
    // 取到连接成功的WiFi的service

    rowClick(record, index) {
      return {
        on: {
          // 点击单行
          click: () => {
            this.showTip = record.state === "ready";
            // 存储当前选中的WiFi对应的service  state   wifiName
            this.wifiService = record.service;
            this.wifiState = record.state;
            this.wifiName = record.wifiName;
            const _this = this;
            this.$axios
              .patch("getCurWifiInfo", {
                service: record.service
              })
              .then(res => {
                if (res.data.retCode === 0) {
                  _this.form.setFieldsValue({
                    // autoLinkWIFI: res.data.info.autoconnect === 1,
                    WIFIName: record.wifiName,
                    WIFIPassword: res.data.info.password
                  });
                }
              });
            // 名称只读 记住选中的wifi 更改类名
            this.nameDisabled = true;
            this.rowId = index;
            this.setRowClassName();
          }
        }
      };
    },
    setRowClassName(record, index) {
      // 斑马纹
      let className = "light-row";
      if (index % 2 === 1) className = "dark-row";

      // 为异常wifi添加errRow类名
      if (this.errIds.includes(index)) {
        className += " errRow";
      }

      // 已连接&选中 显示选中样式
      if (record && record.state == "ready" && index === this.rowId) {
        className += " selectedRow";
        // 仅连接 显示连接样式
      } else if (record && record.state == "ready") {
        className += " linkedRow";
        // 仅选择 显示选择样式
      } else if (index === this.rowId) {
        className += " selectedRow";
      }
      return className;
    },

    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
.wifiSettings {
  padding: 40px 80px;

  .setBtn {
    width: 80px;
    height: 32px;
    border-radius: 2px;
    border: solid 1px #007aff;
    color: #007aff;
  }
  .setBtn:hover {
    color: #fff;
    background-color: #007aff;
  }
  .loading {
    width: 100%;
    height: 96px;
    background-color: #f8f8f8;
    text-align: center;
    margin-bottom: 24px;
    padding: 30px 50px;
  }
  .btn {
    width: 80px;
    color: #fff;
  }
  .deleteBtn {
    width: 80px;
    border-radius: 2px;
    margin-left: 24px;
    border: 1px solid #007aff;
    color: #007aff;
  }
  .deleteBtn:hover {
    background-color: #007aff;
    color: #fff;
  }
  .scanWifi {
    margin-bottom: 24px;
  }
  .showTip {
    display: inline-block;
    padding-left: 136px;
    padding-top: -24px;
    transform: translateY(-20px);
    color: #e83021;
    font-size: 12px;
  }
}
.content {
  width: 100%;
  text-align: center;
  color: #151515;
  height: 50px;
  span.iconfont.iconziyuan13 {
    font-size: 24px;
    color: #ffb100;
    margin-top: -10px;
    // display: inline-block;
    height: 24px;
    margin-bottom: 20px;
    float: left;
  }

  .p1 {
    margin-bottom: 8px;
    height: 14px;
    line-height: 14px;
  }
}
</style>
