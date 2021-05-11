<template>
  <!-- 系统升级 -->
  <div>
    <div v-for="(item, index) in upgradeList" :key="item" class="clearfix">
      <div style="width: 380px">
        <span style="margin-left: 15px">{{ item }}</span>
        <!-- 固件升级 -->
        <span v-if="index === 0">
          <a-upload
            accept=".zip"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button style="width: 180px; margin-top: 30px; margin-left: 30px">
              <a-icon type="upload" />
              <!-- 请导入离线激活文件 -->
              {{ $t("systemUpgrade.importfile") }}
            </a-button>
          </a-upload>
        </span>
        <!-- 应用升级 -->
        <span v-else-if="index === 1">
          <a-upload
            accept=".zip"
            :file-list="fileList1"
            :remove="handleRemove1"
            :before-upload="beforeUpload1"
          >
            <a-button style="width: 180px; margin-top: 30px; margin-left: 30px">
              <a-icon type="upload" />
              <!-- 请导入离线激活文件 -->
              {{ $t("systemUpgrade.importfile") }}
            </a-button>
          </a-upload>
        </span>
      </div>

      <span>
        <a-button
          :disabled="
            index === 0
              ? fileList.length === 0
              : index === 1
              ? fileList1.length === 0
              : true
          "
          type="primary"
          style="margin-top: 30px; margin-left: 15px; color: white"
          @click="handleUpload(index)"
        >
          <!-- {{ "升级" }} -->
          {{ $t("systemUpgrade.upgrade") }}
        </a-button>
      </span>
      <!-- 系统升级提示框  -->
      <a-modal
        class="file-progress"
        :title="
          index === 0 ? fileModalTitle : index === 1 ? appModalTitle : null
        "
        :centered="true"
        :visible="modalShow[index] && showModal"
        :width="290"
        :footer="null"
        :closable="true"
        :maskClosable="false"
        :keyboard="false"
        @cancel="handleCancel"
      >
        <!-- 文件传输中  文件校验中  开始升级 3种状态切换 -->
        <div>
          <p style="text-align: center">{{ fileContent }}</p>
          <div v-if="fileStatus !== 4">
            <a-progress
              v-if="fileStatus === 1"
              :percent="percentNum"
              :showInfo="false"
            />
            <img
              style="border: 1px solid #007aff"
              v-if="fileStatus === 2 || fileStatus === 3"
              :src="loadingGif"
              alt="loadingGif"
            />
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import loadingGif from "../../assets/images/member/loading.gif";
export default {
  data() {
    return {
      flag: false,
      fileList: [],
      fileList1: [],
      loadingGif: loadingGif,
      percentNum: 0,
      fileStatus: null, // 文件状态
      fileContent: "", // 文件状态内容
      showModal: false, // 展示模态框
      zipSource: null,
      formData: null,
      currentClick: null,
      modalShow: [false, false],
      // disabled:true
    };
  },
  mounted() {},
  computed: {
    tipLabel: function () {
      return this.$t("systemUpgrade.tipLabel");
    },
    // 固件升级模态框 标题
    fileModalTitle: function () {
      return this.$t("systemUpgrade.systemup");
    },
    // 应用升级模态框 标题
    appModalTitle: function () {
      return this.$t("systemUpgrade.applicationUpgrade");
    },
    upgradeList: function () {
      return [
        this.$t("systemUpgrade.systemup"),
        this.$t("systemUpgrade.applicationUpgrade"),
      ];
    },
  },
  methods: {
    //移除固件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    //移除应用
    handleRemove1(file) {
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
    },
    //固件上传
    beforeUpload(file, fileList) {
      let filesList = [...this.fileList, file];
      this.fileList = filesList.slice(-1);
      const isZip = file.type.includes("zip");
      if (!isZip) {
        this.fileList = [];
        this.$message.error(this.$t("management.onlyZip"));
      }
      return false;
    },
    //应用上传
    beforeUpload1(file, fileList) {
      let filesList = [...this.fileList1, file];
      this.fileList1 = filesList.slice(-1);
      const isZip = file.type.includes("zip");
      if (!isZip) {
        this.fileList1 = [];
        this.$message.error(this.$t("management.onlyZip"));
      }
      return false;
    },
    // 升级点击事件
    handleUpload(index) {
      this.currentClick = index;
      this.showModal = true;
      let formData = new FormData();
      if (index === 0) {
        this.modalShow[1] = false;
        this.modalShow[0] = true;
        formData.append("package", this.fileList[0]);
        formData.append("packageSize", this.fileList[0].size);
      } else if (index === 1) {
        this.modalShow[0] = false;
        this.modalShow[1] = true;
        formData.append("package", this.fileList1[0]);
        formData.append("packageSize", this.fileList1[0].size);
      }
      this.formData = formData;
      this.fileStatus = 1; // 文件传输中
      this.fileContent = this.$t("systemUpgrade.fileTransfer");
      this.getwebsocketInfo();
    },
    // 取消模态框
    handleCancel() {
      this.showModal = false;
      this.percentNum = 0;
      this.fileStatus = null;
      if (this.zipSource) {
        this.zipSource.cancel(this.$t("management.cancelUpload"));
      }
      if (this.websock && this.websock.readyState === 1) {
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
      }
    },
    getwebsocketInfo() {
      this.$axios.get("/getWebSocketInfo").then((res) => {
        this.port = `${res.data.info.ip}:${res.data.info.port}`;
        this.initWebSocket(this.port, this.formData);
      });
    },
    initWebSocket(port) {
      //初始化weosocket
      const wsuri = `ws://${port}`;
      this.$store.dispatch("setSocketPort", port);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // 文件传输中  文件校验中   开始升级
    websocketonopen() {
      // 连接建立成功
      if (!this.formData) return;
      const CancelToken = this.$axios.CancelToken;
      this.zipSource = CancelToken.source();
      let apiName =
        this.currentClick === 0
          ? "updateFirmware"
          : this.currentClick === 1
          ? "updatePackage"
          : "";
      this.$axios
        .post(apiName, this.formData, {
          timeout: 8000000,
          cancelToken: this.zipSource.token,
          onUploadProgress: (progressEvent) => {
            let complete =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            this.percentNum = complete;
            if (complete === 100) {
              this.fileStatus = 2; // 文件校验中
              this.fileContent = this.$t("systemUpgrade.fileCheck");
              let timer = setTimeout(() => {
                clearTimeout(timer);
                this.fileStatus = 3; // 开始升级
                this.fileContent = this.$t("systemUpgrade.tipLabel");
              }, 1000);
            }
          },
        })
        .then((res) => {
          if (res && res.data.retCode !== 0) {
            this.showModal = false;
            this.percentNum = 0;
            this.$message.destroy();
            this.$message.error(this.$t("systemUpgrade.uperror"));
            if (this.websock && this.websock.readyState === 1) {
              this.websock.send(JSON.stringify({ close: "active" }));
              this.websock.close();
            }
          }
        });
    },
    websocketonmessage(e) {
      console.log(e);
      // 接收服务器数据
      let wsMessage = e.data ? JSON.parse(e.data) : {};
      if (wsMessage.tag === "excepthion_info") {
        // 异常
        this.showModal = false;
        this.percentNum = 0;
        this.$message.destroy();
        this.$message.error(this.$t("systemUpgrade.uperror"));
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
      } else if (wsMessage.tag === "finished") {
        // 成功
        this.showModal = false;
        this.percentNum = 0;
        this.$message.destroy();
        this.$message.success(this.$t("systemUpgrade.upok"));
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
      }
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket(this.port);
    },
    websocketclose(e) {
      console.log("断开连接", e);
    },
  },
};
</script>
<style lang="less" scoped>
.clearfix {
  width: 750px;
  display: flex;
  margin-left: 50px;
  margin-top: 13px;
  .file-progress {
    position: relative;
    top: -2px;
    display: inline-block;
    .center-txt {
      color: red;
      font-size: 14px;
    }
  }
}
</style>
