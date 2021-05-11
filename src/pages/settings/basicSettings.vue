<template>
  <!-- 系统设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="basicSettings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <a-form-item :label="languageLabel" class="toRight language bottom24">
        <a-select class="select" v-model="language" :suffixIcon="downIcon">
          <a-select-option value="zh_CN"> 简体中文 </a-select-option>
          <a-select-option value="en_US"> English </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="volumeLabel" class="toRight volume bottom24">
        <a-row>
          <a-col>
            <a-slider v-model="volume" :min="0" :max="100" />
            <a-input-number
              v-model="volume"
              :min="0"
              :max="100"
              class="showHandler"
              :parser="(value) => value && parseInt(value)"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item :label="brightnessLabel" class="toRight brightness bottom24">
        <a-row>
          <a-col>
            <a-slider v-model="brightness" :min="0" :max="100" />
            <a-input-number
              v-model="brightness"
              :min="0"
              :max="100"
              class="showHandler"
              :parser="(value) => value && parseInt(value)"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <!-- 时区 -->
      <a-form-item
        :label="zoneLabel"
        class="toRight timeZone bottom24 Width535"
      >
        <a-select
          class="select"
          :suffixIcon="downIcon"
          v-model="zoneinfo"
          @change="
            (value) => {
              handleFormChange('zoneinfo', value);
            }
          "
        >
          <a-select-option
            :value="getZoneValue(item)"
            v-for="item in zoneList"
            :key="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 系统时间 -->
      <a-form-item
        :label="systemTimeLabel"
        class="toRight systemTime bottom24 Width535"
      >
        <div>
          {{ $t("basicSettings.equipmenttime") }}
          <a-input
            style="
              width: 270px;
              margin-bottom: 24px;
              margin-left: 5px;
              margin-top: 17px;
              background-color: white;
            "
            disabled
            v-decorator="['EquipmentDate', { validateTrigger: 'blur' }]"
          />
        </div>
        <div>
          <a-radio-group v-model="value" @change="onradioChange">
            <a-radio :style="radioStyle" :value="1">
              {{ $t("basicSettings.NTP") }}
            </a-radio>
            <!-- <a-radio :style="radioStyle" :value="2">
              {{ $t("basicSettings.handupdated") }}
            </a-radio> -->
          </a-radio-group>
        </div>
        <div style="width: 800px !important">
          {{ $t("basicSettings.handupdated") }}
          &nbsp;
          <a-switch
            class="switch"
            v-decorator="[
              'switchOpen',
              {
                valuePropName: 'checked',
              },
            ]"
          />
          <!-- </div> -->
          <!-- :disabled-date="disabledDate  修改时间和日期-->
          <a-date-picker
            :disabled="
              Disabled == false ? (checkDisabled == false ? true : false) : true
            "
            :show-time="{ defaultValue: moment(systemTime, 'HH:mm:ss') }"
            format="YYYY-MM-DD HH:mm:ss"
            v-decorator="[
              'systemDate',
              { initialValue: moment(systemDate, 'YYYY-MM-DD HH:mm:ss') },
            ]"
          />
          <a-checkbox
            :disabled="Disabled"
            style="zoom: 130%; margin-left: 10px"
            @change="onChange"
            v-decorator="[
              'checkOpen',
              {
                valuePropName: 'checked',
              },
            ]"
          >
            {{ $t("basicSettings.setTime") }}
          </a-checkbox>
        </div>
        <!-- <a-button  :disabled= "Disabled" class="setBtn timeBtn sync" @click="setTime">{{
          $t("basicSettings.setTime")
        }}</a-button> -->
      </a-form-item>
      <a-form-item :label="modelLabel" class="model bottom24">
        <span class="ant-form-text">
          {{ model }}
        </span>
      </a-form-item>
      <a-form-item :label="versionLabel" class="osversion bottom24">
        <span class="ant-form-text">
          {{ version }}
        </span>
      </a-form-item>
      <a-form-item :label="cacheLabel" class="cache bottom24">
        <span class="ant-form-text">
          {{ cache }}
        </span>
      </a-form-item>
      <a-form-item :label="storageLabel" class="storage bottom24">
        <span class="ant-form-text">
          {{ totalStorage }} <span class="line">|</span>
          {{ $t("basicSettings.remaining") }}
          {{ availableStorage }}
        </span>
        <br />
        <!-- <span class="storage-tip">
          应用用户数据目录 {{ totalStorage }} <span class="line">|</span> 剩余
          {{ availableStorage }}
        </span> -->
      </a-form-item>
      <a-form-item :label="CPULabel" class="sn bottom24">
        <span class="ant-form-text">
          {{ SN }}
        </span>
      </a-form-item>
      <a-form-item :label="restartLabel" class="toRight restart bottom24">
        <a-button class="setBtn" @click="showRebootConfirm">{{
          restartLabel
        }}</a-button>
      </a-form-item>
      <a-form-item :label="resetLabel" class="toRight reset bottom24">
        <a-button class="setBtn" @click="showResetConfirm">{{
          resetLabel
        }}</a-button>
      </a-form-item>
      <a-form-item label=" " :colon="false" class="top64">
        <a-button
          class="btn"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ this.$t("basicSettings.save") }}
        </a-button>
      </a-form-item>
    </a-form>
    <!-- 重启modal -->
    <a-modal
      :title="rebootRemindTitle"
      :visible="rebootConfirm"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleRebootOk"
          class="modal-submit"
        >
          {{ this.$t("basicSettings.rebootConfirm") }}
        </a-button>
        <a-button key="back" @click="handleRebootCancel" class="modal-cancel">
          {{ this.$t("basicSettings.rebootCancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <p>{{ this.$t("basicSettings.ifRestart") }}</p>
      </div>
    </a-modal>
    <!-- 重置modal -->
    <a-modal
      :title="resetRemindTitle"
      :visible="resetConfirm"
      :centered="true"
      :closable="false"
      :width="380"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleResetOk"
          class="modal-submit"
        >
          {{ this.$t("basicSettings.resetConfirm") }}
        </a-button>
        <a-button key="back" @click="handleResetCancel" class="modal-cancel">
          {{ this.$t("basicSettings.resetCancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <p>{{ this.$t("basicSettings.ifReset") }}</p>
        <p class="red-warning">{{ this.$t("basicSettings.redWarning") }}</p>
      </div>
    </a-modal>
    <!-- 重启中 -->
    <a-modal
      :title="rebootingTitle"
      :visible="rebooting"
      :centered="true"
      :closable="false"
      :width="290"
      :footer="null"
    >
      <div class="content">
        <p>{{ this.$t("basicSettings.rebooting") }}</p>
      </div>
    </a-modal>
    <!-- 重置中 -->
    <a-modal
      :title="resetingTitle"
      :visible="reseting"
      :centered="true"
      :closable="false"
      :width="290"
      :footer="null"
    >
      <div class="content">
        <p>{{ this.$t("basicSettings.reseting") }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "basicSettings",
  data() {
    return {
      value: "",
      radioStyle: {
        display: "block",
        height: "20px",
        lineHeight: "20px",
      },
      downIcon: <span class="iconfont iconziyuan4"></span>,
      language: "简体中文",
      volume: 0,
      brightness: 0,
      infoVolume: "",
      infobrightness: "",
      zoneinfo: "",
      systemDate: null,
      EquipmentDate: null,
      dateTime: null,
      Disabled: true,
      timer: null,
      timerr: null,
      timecom: null,
      switchOpen: false,
      checkOpen: false,
      checkDisabled: true,
      systemTime: "17:24:00",
      model: "",
      version: "",
      cache: "",
      availableStorage: "",
      totalStorage: "",
      SN: "",
      submitLoading: false,
      rebootConfirm: false,
      resetConfirm: false,
      rebooting: false,
      reseting: false,
      resetStatus: null,
      count: 0, //重置-多次请求接口记录成功次数
      restartCount: 0, //重启-多次请求接口记录成功次数
    };
  },
  computed: {
    zoneList: function () {
      return [
        this.$t("basicSettings.zoneHawaii"),
        this.$t("basicSettings.zoneAmerica"),
        this.$t("basicSettings.zoneLondon"),
        this.$t("basicSettings.zoneBeijing"),
        this.$t("basicSettings.zoneTokyo"),
      ];
    },
    CPULabel: function () {
      return this.$t("basicSettings.CPULabel");
    },
    languageLabel: function () {
      return this.$t("basicSettings.languageLabel");
    },
    volumeLabel: function () {
      return this.$t("basicSettings.volumeLabel");
    },
    brightnessLabel: function () {
      return this.$t("basicSettings.brightnessLabel");
    },
    zoneLabel: function () {
      return this.$t("basicSettings.zoneLabel");
    },
    systemTimeLabel: function () {
      return this.$t("basicSettings.systemTimeLabel");
    },
    modelLabel: function () {
      return this.$t("basicSettings.modelLabel");
    },
    versionLabel: function () {
      return this.$t("basicSettings.versionLabel");
    },
    cacheLabel: function () {
      return this.$t("basicSettings.cacheLabel");
    },
    storageLabel: function () {
      return this.$t("basicSettings.storageLabel");
    },
    restartLabel: function () {
      return this.$t("basicSettings.restartLabel");
    },
    resetLabel: function () {
      return this.$t("basicSettings.resetLabel");
    },
    rebootRemindTitle: function () {
      return this.$t("basicSettings.rebootRemindTitle");
    },
    resetRemindTitle: function () {
      return this.$t("basicSettings.resetRemindTitle");
    },
    rebootingTitle: function () {
      return this.$t("basicSettings.rebootingTitle");
    },
    resetingTitle: function () {
      return this.$t("basicSettings.resetingTitle");
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "basicSettings",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("switchOpen")) {
          this.Disabled = !values.switchOpen;
          if (values.switchOpen === false) {
            clearInterval(this.timecom);
            this.form.setFieldsValue({
              checkOpen: false,
            });
          } else if (values.switchOpen === true) {
            this.value = 0;
          }
        } else if (values.hasOwnProperty("checkOpen")) {
          this.checkDisabled = !values.checkOpen;
        }
      },
    });
  },
  mounted() {
    this.getdefaultMsg();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timerr);
    clearInterval(this.timecom);
    clearTimeout(this.timertologin);
    clearTimeout(this.timertologin2);
  },

  methods: {
    moment,
    getLang() {
      switch (this.language) {
        case "简体中文":
          return "zh";
          break;
        case "zh_CN":
          return "zh";
          break;
        case "en_US":
          return "en";
          break;
        default:
      }
    },
    // 单选按钮change事件
    onradioChange(e) {
      if (e.target.value == 1) {
        this.form.setFieldsValue({
          switchOpen: false,
        });
      }
    },
    //通过时区变时间
    handleFormChange(text, item) {
      clearInterval(this.timer);
      clearInterval(this.timerr);
      this.$axios.get("getDeviceSettingInfo").then((res) => {
        if (res.data.retCode === 0) {
          let con = res.data.info.curDateTime;
          let come = Number(con); // returns 23
          this.date = moment(come).format("YYYY-MM-DD HH:mm:ss");
          var time = moment(this.date).format();
          if (item == "right/US/Hawaii") {
            var timezone = -10; //目标时区 夏威夷
          } else if (item == "right/PST8PDT") {
            var timezone = -8; //目标时区 美国
          } else if (item == "right/UTC") {
            var timezone = 0; //目标时区 伦敦
          } else if (item == "right/Asia/Hong_Kong") {
            var timezone = 8; //目标时区 中国
          } else if (item == "right/Asia/Tokyo") {
            var timezone = 9; //目标时区 东京
          }
          var offset_GMT = new Date(time).getTimezoneOffset();
          var nowDate = new Date(time).getTime();
          var targetDate = new Date(
            nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
          ); //当前的时间
          var current = targetDate.getTime(); //当前时区时间戳
          var curDateTime = moment(current).format("YYYY-MM-DD HH:mm:ss"); //转换为时分
          this.form.setFieldsValue({
            systemDate: curDateTime,
            EquipmentDate: curDateTime,
          });
          //设备时间根据新时区的时间+++
          this.dateTime = curDateTime; //获取时间
          let newtime = moment(this.dateTime).format(); //转换成系统识别时间
          let currentS = new Date(newtime).getTime(); //转换为时间戳
          this.timerr = setInterval(() => {
            currentS = currentS + 1000; //给时间戳加1s
            //  将时间戳转换为时间格式
            this.curdateTime = moment(currentS).format("YYYY-MM-DD HH:mm:ss");
            this.form.setFieldsValue({
              EquipmentDate: this.curdateTime,
            });
          }, 1000);
        }
      });
    },

    // 获取菜单列表
    async getMenuList() {
      const _this = this;
      await this.$axios
        .patch("/getRoutesWithAccountId", {
          accountId: _this.$store.state.accountId,
        })
        .then((res) => {
          if (res.data.retCode === 0) {
            _this.$store.dispatch("setMenuList", res.data.info.menu);
          }
        });
    },
    // 保存提交
    handleSubmit() {
      clearInterval(this.timer);
      clearInterval(this.timerr);
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true;
          //为防止用户初始时没有操作保存 初始时区为中文
          if (
            this.zoneinfo === this.$t("basicSettings.zoneHawaii") ||
            this.zoneinfo === "right/US/Hawaii"
          ) {
            this.zoneInfo = "HST";
          } else if (
            this.zoneinfo === this.$t("basicSettings.zoneAmerica") ||
            this.zoneinfo === "right/PST8PDT"
          ) {
            this.zoneInfo = "PST8PDT";
          } else if (
            this.zoneinfo === this.$t("basicSettings.zoneLondon") ||
            this.zoneinfo === "right/UTC"
          ) {
            this.zoneInfo = "UTC";
          } else if (
            this.zoneinfo === this.$t("basicSettings.zoneBeijing") ||
            this.zoneinfo === "right/Asia/Hong_Kong"
          ) {
            this.zoneInfo = "Hongkong";
          } else if (
            this.zoneinfo === this.$t("basicSettings.zoneTokyo") ||
            this.zoneinfo === "right/Asia/Tokyo"
          ) {
            this.zoneInfo = "Japan";
          }
          let zone = this.zoneInfo;
          //提交时要根据时区把时间转换成UTC
          let curDateTimetol;
          if (
            values.switchOpen &&
            this.form.getFieldValue("systemDate") != null
          ) {
            //手动修改时间  如果为空 将设备时间保存
            curDateTimetol = this.form.getFieldValue("systemDate");
          } else {
            //直接提交设备时间
            curDateTimetol = this.form.getFieldValue("EquipmentDate");
          }
          let gmtHours = -new Date().getTimezoneOffset() / 60; //获取本机系统timezone：8
          let timezone = gmtHours;
          let offset_GMT;
          if (this.zoneInfo === "HST") {
            offset_GMT = 600;
          } else if (this.zoneInfo === "PST8PDT") {
            offset_GMT = 480;
          } else if (this.zoneInfo === "UTC") {
            offset_GMT = 0;
          } else if (this.zoneInfo === "Hongkong") {
            offset_GMT = -480;
          } else if (this.zoneInfo === "Japan") {
            offset_GMT = -540;
          }
          let nowDate = new Date(curDateTimetol).getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
          let targetDate = new Date(
            nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
          ); //当前的时间
          let current = targetDate.getTime();
          this.curDateTimesave = String(current);
          const _this = this;
          let language = this.language === "简体中文" ? "zh_CN" : this.language;
          this.$axios
            .patch("setDeviceSettingInfo", {
              volume: Math.floor((_this.volume / 100) * 255),
              brightness: Math.floor((_this.brightness / 100) * 255),
              timezone: zone,
              ntp: this.value == 1 ? 1 : 0,
              curDateTime: this.curDateTimesave,
              language,
            })
            .then(async (res) => {
              if (res.data.retCode === 0) {
                this.submitLoading = false;
                this.$message.destroy();
                this.$message.success(this.$t("basicSettings.settingOk"));
                let lang = _this.getLang();
                localStorage.setItem("lang", lang);
                _this.$i18n.locale = lang;
                _this.$store.commit("setLanguage", language);
                await this.getMenuList();
                await this.getdefaultMsg();
                // 由于路由守卫在路由切换后执行，手动切换当前页title
                document.title = _this.$t(this.$route.meta.title);
              } else {
                this.submitLoading = false;
                this.$message.destroy();
                this.$message.error(res.data.retMsg);
              }
            });
        }
      });
    },

    // 获取默认信息
    async getdefaultMsg() {
      const _this = this;
      await this.$axios.get("getDeviceSettingInfo").then((res) => {
        if (res.data.retCode === 0) {
          this.timer && clearInterval(this.timer);
          let info = res && res.data && res.data.info;
          _this.volume = Math.ceil((info.volume / 255) * 100);
          _this.brightness = Math.ceil((info.brightness / 255) * 100);
          _this.zoneinfo = this.getZone(info.zoneinfo);
          _this.model = info.deviceType;
          _this.version = info.firmwareVersion;
          _this.cache =
            info.memoryInfo.total >= 1024
              ? (info.memoryInfo.total / 1024).toFixed(2) + "G"
              : info.memoryInfo.total + "M";
          _this.availableStorage =
            info.storageInfo.available >= 1024
              ? (info.storageInfo.available / 1024).toFixed(2) + "G"
              : info.storageInfo.available + "M";
          _this.totalStorage =
            info.storageInfo.total >= 1024
              ? (info.storageInfo.total / 1024).toFixed(2) + "G"
              : info.storageInfo.total + "M";
          _this.SN = info.sn;
          _this.value = info.ntp == 1 ? 1 : 0;
          //返回为时间戳 换算出当前时区对应的时间 zoneinfo格式不正确时默认为HKT（返回的timezone可能有两种情况）
          let con = res.data.info.curDateTime;
          let come = Number(con); // returns 23
          _this.date = moment(come).format("YYYY-MM-DD HH:mm:ss");
          let time = moment(_this.date).format();
          if (info.zoneinfo == "HST" || info.zoneinfo == "-10") {
            var timezone = -10;
          } else if (info.zoneinfo == "PST" || info.zoneinfo == "-08") {
            var timezone = -8;
          } else if (info.zoneinfo == "UTC" || info.zoneinfo == "GMT") {
            var timezone = 0;
          } else if (info.zoneinfo == "HKT" || info.zoneinfo == "+08") {
            var timezone = 8;
          } else if (info.zoneinfo == "JST" || info.zoneinfo == "+09") {
            var timezone = 9;
          } else {
            var timezone = 8;
          }
          var offset_GMT = new Date(time).getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟   (机器时间和格林威治的时间差)
          var nowDate = new Date(time).getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
          var targetDate = new Date(
            nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
          ); //当前的时间
          var current = targetDate.getTime(); //当前时区时间戳
          var curDateTime = moment(current).format("YYYY-MM-DD HH:mm:ss"); //转换为时分秒
          _this.form.setFieldsValue({
            systemDate: curDateTime,
            //给设备时间赋一个初始值
            EquipmentDate: curDateTime,
          });
          //设备时间动态++
          _this.dateTime = curDateTime; //获取时间
          let newtime = moment(_this.dateTime).format(); //转换成系统识别时间
          let current = new Date(newtime).getTime(); //转换为时间戳
          this.timer = setInterval(() => {
            current = current + 1000; //给时间戳加1s
            this.curdateTime = moment(current).format("YYYY-MM-DD HH:mm:ss");
            _this.form.setFieldsValue({
              EquipmentDate: this.curdateTime,
            });
          }, 1000);
          _this.language = info.language;
          if (!info.curDateTime) {
            this.getNowDate();
          }
        }
      });
    },
    getNowDate() {
      this.systemDate = this.$utils.getNow(true);
    },
    showRebootConfirm() {
      this.rebootConfirm = true;
    },
    showResetConfirm() {
      this.resetConfirm = true;
    },

    // 手动重启
    handleRebootOk() {
      this.rebootConfirm = false;
      this.rebooting = true;
      this.$axios.get("reboot");
      let startTime = Date.now();
      let timer = setInterval(() => {
        if (Date.now() - startTime > 30000) {
          console.log("重启超时跳转登录页面。。。");
          this.rebooting = false;
          this.$message.destroy();
          this.$message.error(this.$t("basicSettings.reRebootTimeout"));
          clearInterval(timer);
          setTimeout(() => {
            this.$message.destroy();
            this.$router.replace("/login");
          }, 3000);
        } else {
          console.log("重复请求getDeviceSettingInfo。。。");
          this.$axios.get("getDeviceSettingInfo?t" + Date.now()).then((res) => {
            if (res && res.data.retCode === 0) {
              console.log("请求成功。。。。");
              this.restartCount++;
              if (this.restartCount > 1) return;
              clearInterval(timer);
              this.rebooting = false;
              this.$message.destroy();
              this.$message.success(this.$t("basicSettings.rebootSuccess"));
              setTimeout(() => {
                this.$router.go(0);
              }, 3000);
            } else {
              this.restartCount = 0;
              this.$message.destroy();
            }
          });
        }
      }, 5000);
    },
    handleRebootCancel() {
      this.rebootConfirm = false;
    },
    // 恢复出厂设置
    handleResetOk() {
      this.resetConfirm = false;
      this.reseting = true;
      this.getwebsocketInfo();
    },
    // 获取websocket服务器网址
    getwebsocketInfo() {
      this.$axios.get("/getWebSocketInfo").then((res) => {
        this.port = `${res.data.info.ip}:${res.data.info.port}`;
        this.initWebSocket(this.port);
      });
    },
    initWebSocket(port) {
      const wsuri = `ws://${port}`;
      this.$store.dispatch("setSocketPort", port);
      this.websock = new WebSocket(wsuri);
      // websocket apis
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      // 连接建立成功 请求重置设备接口
      this.$axios.get("/resetDevice").then((res) => {
        if (res.data.retMsg === "timeout") {
          this.reseting = false;
          this.$message.destroy();
          this.$message.error(this.$t("basicSettings.failedMessage"));
        }
      });
    },
    websocketonmessage(e) {
      //接收服务端数据
      let reqData = e.data ? JSON.parse(e.data) : {};
      let timer;
      if (reqData.tag === "exception_info") {
        // 异常处理
        this.reseting = false;
        this.$message.destroy();
        this.$message.error(this.$t("basicSettings.failedMessage"));
      } else if (reqData.tag === "finished") {
        // 重置成功 关闭连接
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
        // this.reseting = false;
        let startTime = Date.now();

        let timer = setInterval(() => {
          if (Date.now() - startTime > 30000) {
            clearInterval(timer);
            this.reseting = false;
            this.$message.destroy();
            this.$message.error(this.$t("basicSettings.resetTimeout"));
            this.timertologin = setTimeout(() => {
              this.$router.replace("/login");
            }, 3000);
          } else {
            this.$axios.get("getLanguage").then((res) => {
              if (res.data.retCode === 0) {
                this.count++;
                if (this.count > 1) return;
                clearInterval(timer);
                this.reseting = false;
                this.$message.destroy();
                this.$message.success(this.$t("basicSettings.successMessage"));
                this.timertologin2 = setTimeout(() => {
                  this.$message.destroy();
                  this.$router.replace("/login");
                }, 3000);
              } else {
                this.count = 0;
              }
            });
          }
        }, 5000);
      }
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket(this.port);
    },

    handleResetCancel() {
      this.resetConfirm = false;
    },
    //与计算机时间同步  同步后要动态
    onChange(e) {
      if (e.target.checked === true) {
        let nowData = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        //转换为系统识别时间
        let newtime = moment(nowData).format();
        let current = new Date(newtime).getTime(); //转换为时间戳
        // let current = new Date(nowData).getTime(); //转换为时间戳
        this.timecom = setInterval(() => {
          current = current + 1000; //给时间戳加1s
          //  将时间戳转换为时间格式
          let now = moment(current).format("YYYY-MM-DD HH:mm:ss");
          this.form.setFieldsValue({
            systemDate: now,
          });
        }, 1000);
      } else {
        clearInterval(this.timecom);
      }
    },
    //获取默认值后显示的时区
    getZone(zone) {
      let label = "";
      label =
        zone === "-10" || zone === "HST"
          ? this.$t("basicSettings.zoneHawaii")
          : zone === "-08" || zone === "PST"
          ? this.$t("basicSettings.zoneAmerica")
          : zone === "-00" || zone === "UTC" || zone === "GMT"
          ? this.$t("basicSettings.zoneLondon")
          : zone === "+08" || zone === "HKT"
          ? this.$t("basicSettings.zoneBeijing")
          : zone === "+09" || zone === "JST"
          ? this.$t("basicSettings.zoneTokyo")
          : this.$t("basicSettings.zoneBeijing");
      return label;
    },
    getZoneValue(zone) {
      return zone === this.$t("basicSettings.zoneHawaii")
        ? "right/US/Hawaii"
        : zone === this.$t("basicSettings.zoneAmerica")
        ? "right/PST8PDT"
        : zone === this.$t("basicSettings.zoneLondon")
        ? "right/UTC"
        : zone === this.$t("basicSettings.zoneBeijing")
        ? "right/Asia/Hong_Kong"
        : zone === this.$t("basicSettings.zoneTokyo")
        ? "right/Asia/Tokyo"
        : "right/UTC";
    },
  },
};
</script>

<style lang="less" scoped>
.basicSettings {
  padding: 40px 80px;
  .language {
    .iconfont {
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      color: #b1b1b1;
      position: absolute;
      right: 0;
    }
  }
  .ant-slider {
    width: 224px;
    display: inline-block;
    margin: 14px 6px -2px;
  }

  .ant-input-number {
    width: 56px;
    margin-left: 7px;
  }
  span#basicSettings_systemDate {
    width: 160px;
    min-width: 160px !important;
  }
  input.ant-input-number-input,
  input.ant-calendar-picker-input.ant-input {
    font-size: 12px;
  }
  input.ant-calendar-picker-input.ant-input {
    padding: 9px 8px !important;
  }
  .setBtn {
    width: 136px;
    height: 32px;
    border-radius: 2px;
    border: solid 1px #007aff;
    color: #007aff;
    padding: 0;
  }
  .sync {
    margin-left: 54px;
  }
  .setBtn:hover {
    color: #fff;
    background-color: #007aff;
  }
  .btn {
    width: 80px !important;
  }
  .line {
    font-weight: 700;
    color: #007aff;
  }
  .storage-tip {
    margin-top: 4px;
    color: #707070;
    font-size: 12px;
    display: inline-block;
  }
  .systemTime {
    height: 145px !important;
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
  .red-warning {
    font-size: 12px;
    color: red;
  }
}
.en .Width535 .timeBtn.setBtn {
  width: 320px;
}
.en .basicSettings .setBtn {
  width: 225px;
}
</style>
