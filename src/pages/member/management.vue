<template>
<!-- 人员管理 -->
  <div class="management">
    <div class="topSearch">
      <div class="leftContent">
        <div class="input">
          <input
            v-model="searchContent"
            type="text"
            :placeholder="searchLabel"
            @blur="searchChange"
            @keyup.13="enterSearch"
            ref="inputSearch"
          />
          <span
            class="clear iconfont iconcuowu-yuan-tianchong"
            @click="clearInput"
          ></span>
          <span class="iconfont iconsousuo"></span>
        </div>
        <div class="select" @click="select" v-show="!isSelect">
          <span class="iconfont iconpiliang"></span>
          <span>{{ $t("management.select") }}</span>
        </div>
        <div class="select" @click="select" v-show="isSelect">
          <span class="iconfont iconpiliang"></span>
          <span>{{ $t("management.cancelSelect") }}</span>
        </div>
        <div
          class="selectAll"
          v-show="!isSelectAll && isSelect"
          @click="selectAll"
        >
          <span class="iconfont iconquanxuan-weijihuo"></span>
          <span>{{ $t("management.selectAll") }}</span>
        </div>
        <div
          class="selectAll active"
          v-show="isSelectAll && isSelect"
          @click="selectAll"
        >
          <span class="iconfont iconquanxuan-jihuo"></span>
          <span>{{ $t("management.selectAll") }}</span>
        </div>
        <div
          class="delete"
          v-show="isSelect && selectItemList && selectItemList.length !== 0"
          @click="showDeleteConfirm"
        >
          <span class="iconfont iconshanchu"></span>
          <span>{{ $t("management.delete") }}</span>
        </div>
      </div>
      <div class="register">
        <router-link to="/member/register" class="single-register">
          <span class="iconfont iconzhuce"></span>
          <span>{{ $t("management.singleRegister") }}</span>
        </router-link>
        <div class="download" @click="downloadTemplate">
          <span class="iconfont iconxiazai"></span>
          <span>{{ $t("management.download") }}</span>
        </div>
        <a-upload
          class="bulk-register member"
          name="file"
          accept=".zip"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          :customRequest="customRequest"
          ref="upload"
        >
          <a-button
            ><span class="iconfont iconpiliangzhuce"></span
            >{{ $t("management.bulkRegister") }}</a-button
          >
        </a-upload>
        <div class="expainContent" @click="showExplain">
          <span class="explainIcon iconfont iconwenhao"></span>
        </div>
      </div>
    </div>
    <!-- 人员招聘区域 -->
    <div class="table-content">
      <div class="table-title">
        <span class="iconfont iconrenshu"></span>
        <span v-if="!isFilter">{{ $t("management.total") }}{{ total }}</span>
        <span v-else>{{ $t("management.selectTotal") }}{{ total }}</span>
      </div>
      <div>
        <div v-if="isSelect" class="memberWrapper">
          <member-item
            class="item member-item"
            :canSelect="isSelect"
            v-for="item in stateMembers"
            :key="item.pId"
            :member="item"
            @selectItem="addCheckedItem"
          />
        </div>
        <div v-else class="members">
          <router-link
            :to="'/member/management/lookover/' + item.pId"
            class="item"
            v-for="item in members"
            :key="item.pId"
          >
            <member-item :member="item" />
          </router-link>
        </div>
      </div>
      <div class="placeholder-box"></div>
      <div class="pagination">
        <a-pagination
          :current="page"
          :total="total"
          :pageSize="pageCount"
          @change="handlePageChange"
        />
      </div>
    </div>
    <!-- 批量导入modal -->
    <a-modal
      :class="{ en: $store.state.language === 'en_US' }"
      :destroyOnClose="true"
      :title="bulkTitle"
      :visible="bulkModal"
      :centered="true"
      :width="290"
      :footer="null"
      class="bulk-register"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      @cancel="handleCancel"
    >
      <div v-if="!isUploadSuccess">
        <!-- 文件上传中 -->
        <p class="center-txt">{{ isUploadSuccessTxt }}</p>
        <img :src="loadingGif" alt="loadingGif" />
      </div>
      <div v-else>
        <p v-show="!showProgressInfo" class="center-txt">{{ progressTxt }}</p>
        <img
          :src="uploadGif"
          alt="uploadGif"
          v-show="!showProgressInfo"
          class="uploadGif"
        />
        <a-progress
          v-show="showProgressInfo"
          :percent="
            registerTotal === 0
              ? 0
              : Math.floor(((successTotal + failTotal) * 100) / registerTotal)
          "
          :showInfo="showProgressInfo"
        />
        <div class="total">
          {{ $t("management.registerTotal") }}{{ registerTotal }}
        </div>
        <div class="successNum">
          {{ $t("management.successTotal") }}{{ successTotal }}
        </div>
        <div class="failNum">
          {{ $t("management.failTotal") }}{{ failTotal }}
        </div>
        <div class="loading" v-if="!fail && !success">
          {{ bulkLoadingTxt }}
        </div>
        <button class="success" v-if="success" @click="handleCancel">
          {{ $t("management.success") }}
        </button>
        <button class="lookFail" v-if="fail" @click="downLoadFail">
          {{ $t("management.checkFail") }}
        </button>
      </div>
    </a-modal>
    <!-- 删除modal框 -->
    <a-modal
      :class="{ en: $store.state.language === 'en_US' }"
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
          {{ $t("management.confirm") }}
        </a-button>
        <a-button
          key="back"
          @click="handleDeleteCancel"
          class="modal-cancel"
          :disabled="confirmLoading"
        >
          {{ $t("management.cancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div class="p1">{{ $t("management.whetherDelete") }}</div>
        <div class="p2">{{ $t("management.deleteRemind") }}</div>
      </div>
    </a-modal>
    <a-modal
      class="explainModal"
      :title="explainTitle"
      :visible="explainModal"
      :centered="true"
      :closable="true"
      :width="510"
      @cancel="handleExplainCancel"
      :footer="null"
    >
      <div class="content">
        <p>{{ $t("management.step") }}</p>
        <p>
          {{ $t("management.step1") }}
        </p>
        <p class="second-p">
          {{ $t("management.stepA") }}
        </p>
        <p class="second-p">
          {{ $t("management.stepB") }}
        </p>
        <p>{{ $t("management.step2") }}</p>

        <p class="section">{{ $t("management.notice") }}</p>
        <p>
          {{ $t("management.notice1") }}
        </p>
        <p>{{ $t("management.notice2") }}</p>
        <p>
          {{ $t("management.notice3") }}
        </p>
      </div>
    </a-modal>
    <a-modal
      :visible="csvImgerr"
      :centered="true"
      :closable="false"
      :width="288"
      :height="140"
      :footer="null"
      class="registerFail"
    >
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div class="iconfont-text">{{ csvImgerrMsg }}</div>
        <a-button
          type="primary"
          @click="csvImgerr = false"
          class="modal-submit submit-margin"
        >
          {{ $t("management.confirm") }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import MemberItem from "./childComponents/memberItem";
import { mapState } from "vuex";
import { target } from "../../../config/index";
import loadingGif from "../../assets/images/member/loading.gif";
import uploadGif from "../../assets/images/member/upload.gif";
export default {
  name: "management",
  components: {
    MemberItem,
  },
  data() {
    return {
      members: [],
      isSelect: false,
      isSelectAll: false,
      bulkModal: false,

      isUploadSuccess: false, //批量注册是否已经上传成功
      showProgressInfo: false,
      headers: {
        authorization: "authorization-text",
      },
      percent: 75,
      success: false,
      fail: false,
      deleteComfirm: false,
      confirmLoading: false,
      page: 1,
      pageCount: 40,
      total: 0,
      isFilter: false,
      searchContent: "",
      registerTotal: 0,
      successTotal: 0,
      failTotal: 0,
      flag: true,
      failFile: null,
      explainModal: false,
      csvImgerr: false,
      csvImgerrMsg: "",
      port: 0,
      loadingGif: loadingGif,
      uploadGif: uploadGif,
      zipSource: null,
      isFileOk: false,
      formData: null,
      regNum: 0, //批量注册完成的个数，每完成10个，刷新列表
      template: "",
      bulkLoadingTxt: this.$t("management.bulkLoadingTxt"),
    };
  },
  created() {
    this.page = Number(sessionStorage.getItem("page")) || 1;
  },
  computed: mapState({
    stateMembers: (state) => state.members,
    selectItemList: function (state) {
      let list = [];
      for (let item of state.members) {
        if (item.checked) {
          list.push(item.pId);
        }
      }
      return list;
    },
    bulkTitle: function () {
      return this.$t("management.bulkTitle");
    },
    isUploadSuccessTxt: function () {
      return this.$t("management.isUploadSuccessTxt");
    },
    deleteTitle: function () {
      return this.$t("management.deleteTitle");
    },
    explainTitle: function () {
      return this.$t("management.explainTitle");
    },
    searchLabel: function () {
      return this.$t("management.searchLabel");
    },
  }),
  mounted() {
    if (
      this.$store.state.registerTotal >
      this.$store.state.successTotal + this.$store.state.failTotal
    ) {
      this.initWebSocket(this.$store.state.socketPort);
      this.registerTotal = this.$store.state.registerTotal;
      this.successTotal = this.$store.state.successTotal;
      this.failTotal = this.$store.state.failTotal;
    }
    this.getTemplate();
  },
  activated() {
    this.searchContent = this.$store.state.searchContent || "";
    this.getMembers();
  },
  beforeRouteLeave(to, from, next) {
    //要在离开该组件的时候控制需要缓存的组件，否则将出现第一次不缓存的情况
    if (to.path.indexOf("/lookover") != -1) {
      // 去往详情页的时候需要缓存组件，其他情况下不需要缓存
      this.$store.commit("setSearchContent", this.searchContent);
      //存储当前页码 防止刷新后会到第一页
      sessionStorage.setItem("page", this.page);
    } else {
      this.$store.commit("setSearchContent", "");
      //销毁页面page页码
      sessionStorage.removeItem("page");
    }
    next();
  },

  methods: {
    getTemplate() {
      this.$axios.get("downloadTemplate").then((res) => {
        if (res.data.retCode === 0) {
          this.template = res.data.info.filePath;
        }
      });
    },
    // 换页
    handlePageChange(page) {
      this.page = page;
      this.getMembers();
      this.isSelectAll = false;
    },
    showExplain() {
      this.explainModal = true;
    },
    handleExplainCancel() {
      this.explainModal = false;
    },
    // 是否可选
    select() {
      this.isSelect = !this.isSelect;
      if (!this.isSelect) {
        this.isSelectAll = false;
        let stateMembers = this.stateMembers;
        for (let item of stateMembers) {
          item.checked = false;
        }
        this.$store.commit("setMembers", stateMembers);
      }
    },
    // 全选切换
    selectAll() {
      this.isSelectAll = !this.isSelectAll;
      let stateMembers = JSON.parse(JSON.stringify(this.stateMembers));
      for (let item of stateMembers) {
        item.checked = this.isSelectAll;
      }
      this.$store.commit("setMembers", stateMembers);
    },
    // 点击删除
    showDeleteConfirm() {
      this.deleteComfirm = true;
    },
    // 取消删除
    handleDeleteCancel(e) {
      this.deleteComfirm = false;
    },
    // 删除人员
    handleDeleteOk() {
      this.confirmLoading = true;
      const _this = this;
      this.$axios
        .patch("deletePersons", {
          personIds: this.selectItemList,
        })
        .then((res) => {
          _this.confirmLoading = false;
          if (res.data.retCode === 0) {
            _this.deleteComfirm = false;
            _this.isSelectAll = false;
            if (
              _this.selectItemList.length === _this.members.length &&
              Math.ceil(_this.total / _this.pageCount) === _this.page
            ) {
              _this.page = _this.page - 1;
            }
            _this.getMembers();
          } else {
            _this.deleteComfirm = false;
            _this.$message.destroy();
            _this.$message.error(this.$t("management.deleteFail"));
          }
        });
    },
    searchChange() {
      this.page = 1;
      this.getMembers();
    },
    enterSearch() {
      this.searchChange();
      this.$refs.inputSearch.blur();
    },
    // 获取人员信息
    getMembers() {
      // 根据查询内容切换【筛选】和【人员总数】
      this.$store.commit("setSearchContent", "");
      this.isFilter = this.searchContent !== "";
      const _this = this;
      this.$axios
        .patch("getPaginatedPersonInfo", {
          page: _this.page,
          pageCount: _this.pageCount,
          search: _this.searchContent,
        })
        .then((res) => {
          if (res.data.retCode === 0) {
            let members = res.data.info;
            //  设置所有人员未选中 存入vuex
            for (let member of members) {
              member.checked = false;
            }
            _this.$store.commit("setMembers", members);
            _this.members = res.data.info;
            _this.total = res.data.total;
          }
        });
    },
    // 单选人员 根据选中人数设置全选状态
    addCheckedItem() {
      var data = this.stateMembers.filter(function (item) {
        return item.checked == false;
      });
      this.isSelectAll = data.length === 0 ? true : false;
    },
    downloadTemplate() {
      window.open(this.template);
    },
    // 自定义文件上传、更改文件上传顺序
    beforeUpload(file, fileList) {
      let isFileOk = true;
      const isZip = file.type.includes("zip");
      if (!isZip) {
        this.fileList = [];
        this.$message.error(this.$t("management.onlyZip"));
        isFileOk = false;
      }

      const isLt = file.size / 1024 / 1024 < 1024;
      if (!isLt) {
        this.fileList = [];
        this.$message.error(this.$t("management.tooLarge"));
        isFileOk = false;
      }
      // 将csv文件抽离
      if (isFileOk) {
        this.bulkModal = true;
      }

      // 节流阀
      this.isFileOk = isFileOk;
      return isFileOk;
    },
    customRequest(options) {
      const { file } = options;
      let formData = new FormData();
      formData.append("zipFile", file);
      formData.append("fileSize", file.size);
      this.formData = formData;
      this.getwebsocketInfo();
    },
    getwebsocketInfo() {
      this.$axios.get("/getWebSocketInfo").then((res) => {
        this.port = `${res.data.info.ip}:${res.data.info.port}`;
        this.initWebSocket(this.port, this.formData);
      });
    },
    initWebSocket(port) {
      //初始化weosocket
      if (!this.bulkModal) {
        this.bulkModal = true;
        this.isUploadSuccess = true;
        this.showProgressInfo = true;
        this.bulkLoadingTxt = this.$t("management.bulkLoadingTxt1");
      }
      const wsuri = `ws://${port}`;
      this.$store.dispatch("setSocketPort", port);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      if (this.formData) {
        const CancelToken = this.$axios.CancelToken;
        this.zipSource = CancelToken.source();
        this.$axios
          .post("batchRegisterWithZipFile", this.formData, {
            timeout: 8000000,
            // 必须对请求进行cancelToken设置
            cancelToken: this.zipSource.token,
            onUploadProgress: (progressEvent) => {
              let complete =
                (((progressEvent.loaded / progressEvent.total) * 100) | 0) +
                "%";
              this.uploadPercent = complete;
            },
          })
          .then((res) => {
            if (res.data.info.retCode === 0) {
              this.isUploadSuccess = true;
              this.progressTxt = this.$t("management.progressTxt");
            } else {
              this.$error({
                title: this.$t("management.uploadFail"),
                okText: this.$t("management.confirm"),
                width: 286,
                centered: true,
                keyboard: false,
              });
              this.bulkModal = false;
              if (this.websock && this.websock.readyState === 1) {
                this.websock.send(JSON.stringify({ close: "active" }));
                this.websock.close();
              }
            }
          })
          .catch(() => {
            this.$error({
              title: this.$t("management.uploadFail"),
              okText: this.$t("management.confirm"),
              width: 286,
              centered: true,
              keyboard: false,
            });
            this.bulkModal = false;
          });
      }
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket(this.port);
    },
    websocketonmessage(e) {
      //数据接收
      let regData = e.data ? JSON.parse(e.data) : {};
      if (regData.tag === "excepthion_info") {
        this.showProgressInfo = false;
        if (regData.code !== 0) {
          this.$error({
            title: regData.info.msg,
            okText: this.$t("management.confirm"),
            width: 286,
            centered: true,
            keyboard: false,
          });
          this.bulkModal = false;
        }
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
      } else if (regData.tag === "register_progress") {
        this.bulkLoadingTxt = this.$t("management.bulkLoadingTxt");
        this.showProgressInfo = true;
        this.regNum++;
        if (this.regNum == 10) {
          this.regNum = 0;
          this.page = 1;
          this.getMembers();
        }
        this.registerTotal = regData.totalCount;
        this.successTotal = regData.successCount;
        this.failTotal = regData.failedCount;
        this.$store.dispatch("setRegisterTotal", regData.totalCount);
        this.$store.dispatch("setSuccessTotal", regData.successCount);
        this.$store.dispatch("setFailTotal", regData.failedCount);
      } else if (regData.tag === "finished") {
        this.showProgressInfo = true;
        this.registerTotal = regData.totalCount;
        this.successTotal = regData.successCount;
        this.failTotal = regData.failedCount;
        this.$store.dispatch("setRegisterTotal", regData.totalCount);
        this.$store.dispatch("setSuccessTotal", regData.successCount);
        this.$store.dispatch("setFailTotal", regData.failedCount);
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
        this.page = 1;
        this.getMembers();
        if (regData.failedCount !== 0) {
          this.fail = true;
          this.failFile = regData.info.failed_file;
        } else {
          this.success = true;
        }
      }
    },
    websocketsend(Data) {},
    websocketclose(e) {
      //关闭
      console.log(e);
    },
    // 关闭批量注册modal
    handleCancel() {
      this.bulkModal = false;
      this.flag = true;
      this.failFile = null;
      this.registerTotal = 0;
      this.successTotal = 0;
      this.failTotal = 0;
      this.fail = null;
      this.success = null;
      this.isUploadSuccess = false;
      this.showProgressInfo = false;
      if (this.zipSource) {
        this.zipSource.cancel(this.$t("management.cancelUpload"));
      }
      if (this.websock && this.websock.readyState === 1) {
        this.websock.send(JSON.stringify({ close: "active" }));
        this.websock.close();
      }
      this.$store.dispatch("setRegisterTotal", 0);
      this.$store.dispatch("setSuccessTotal", 0);
      this.$store.dispatch("setFailTotal", 0);
    },
    downLoadFail() {
      window.open(this.failFile);
    },
    clearInput() {
      this.searchContent = "";
      this.page = 1;
      this.getMembers();
    },
  },
};
</script>

<style lang="less" scoped>
.en .topSearch {
  width: calc(100% - 240px) !important;
  left: 240px !important;
}
.en .pagination {
  margin-left: 80px;
  margin-right: 10px;
  width: calc(100% - 230px) !important;
}
.management {
  width: 100%;
  position: relative;
  .topSearch {
    background-color: #fff;
    width: calc(100% - 160px);
    height: 47px;
    position: fixed;
    top: 48px;
    left: 160px;
    padding: 7px 24px 0 24px;
    border-bottom: 1px solid rgba(0, 122, 255, 0.24);
    z-index: 999;
    .expainContent {
      display: inline-block;
      margin-left: 4px;
      cursor: pointer;
      .explainIcon {
        color: #b1b1b1;
      }
    }

    .leftContent {
      float: left;
      .iconfont {
        margin-right: -2px;
        vertical-align: bottom;
      }
      div {
        float: left;
      }
      .input:hover .clear {
        display: inline;
        font-size: 10px !important;
        color: rgba(0, 0, 0, 0.25);
        position: absolute;
        left: 510px;
        top: 8px;
      }
      .input:hover .clear:hover {
        color: rgba(0, 0, 0, 0.45);
        transition: color 0.3s ease, opacity 0.15s ease;
      }
      .input {
        width: 270px;
        height: 32px;
        position: relative;
        .clear {
          display: none;
          cursor: pointer;
        }
        input {
          width: 100%;
          height: 100%;
          background-color: #f5f7fa;
          border-radius: 20px !important;
          border: none;
          padding-left: 40px;
          color: #151515;
        }
        input::-webkit-input-placeholder {
          color: #b1b1b1;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #b1b1b1;
        }
        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #b1b1b1;
        }
        input:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #b1b1b1;
        }
        input:focus {
          outline: none;
        }
        .iconfont {
          margin-left: -260px;
          font-size: 16px;
          vertical-align: middle;
        }
      }
      .select {
        margin-left: 16px;
        margin-right: 4px;
        .iconfont {
          font-size: 16px;
        }
      }
    }

    .register {
      height: 32px;
      float: right;
      font-size: 14px;
      position: relative;
    }
    .delete {
      .iconfont {
        margin-right: 2px;
      }
    }
    .single-register {
      margin-right: 4px;
    }
    .download {
      margin-right: 4px;
    }

    .select,
    .selectAll,
    .delete,
    .single-register,
    .download {
      display: inline-block;
      height: 32px;
      width: 88px;
      line-height: 30px;
      text-align: center;
      border-radius: 2px;
      cursor: pointer;
      padding-top: 1px;
    }

    .single-register {
      color: #007aff;
    }
    .bulk-register {
      position: relative;
      top: -2px;
      display: inline-block;
    }
    .selectAll {
      margin-right: 4px;
    }
    .selectAll.active {
      color: #007aff;
    }
    .select:active,
    .select:hover,
    .single-register:active,
    .single-register:hover,
    .selectAll:active,
    .selectAll:hover,
    .download:active,
    .download:hover,
    .delete:active,
    .delete:hover {
      color: #007aff;
      border: 1px solid #007aff;
      text-align: center;
      line-height: 28px;
    }
  }
  .table-content {
    margin-top: 48px;
    .table-title {
      height: 40px;
      line-height: 40px;
      color: #151515;
      padding-left: 24px;
      .iconfont {
        vertical-align: bottom;
      }
    }
    .members {
      margin: 0 8px 45px 24px;
      display: flex;
      flex-wrap: wrap;
      .item {
        // flex: 0 0 calc(12.5% - 16px);
        display: inline-block;
        margin-bottom: 16px;
        text-align: center;
        margin-right: 16px;
        // width: 0;
        width: calc(100% / 8 - 16px);
      }
      .item:nth-child(8n) {
        margin-right: 0;
      }
    }
    .memberWrapper {
      display: flex;
      flex-wrap: wrap;
      margin: 0 8px 0 24px;
      .item {
        display: inline-block;
        margin-bottom: 16px;
        text-align: center;
        margin-right: 16px;
        width: calc(100% / 8 - 16px);
      }
      .item:nth-child(8n) {
        margin-right: 0;
      }
    }
    .placeholder-box {
      width: 100%;
      height: 64px;
      position: relative;
      bottom: 0;
    }
    .pagination {
      padding-right: 40px;
      position: fixed;
      background: #fff;
      height: 64px;
      bottom: 0;
      left: 160px;
      width: calc(100% - 160px);
      padding-top: 16px;
      ul {
        float: right;
      }
    }
  }
}
.explainModal {
  p {
    text-align: left;
  }
}
.total,
.successNum,
.failNum {
  color: #151515;
  margin-top: 16px;
  line-height: 14px;
  height: 14px;
  font-size: 14px;
}
.total {
  margin-top: 10px;
}
.success:hover,
.success:focus {
  background-color: #006fe8;
  outline: none;
}
.success {
  width: 80px;
  height: 32px;
  background-color: #007aff;
  border-radius: 2px;
  color: #fff;
  border: none;
  margin-top: 24px;
  margin-left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}
.loading {
  width: 80px;
  text-align: center;
  line-height: 32px;
  display: inline-block;
  height: 32px;
  border-radius: 2px;
  border: solid 1px #007aff;
  color: #007aff;
  margin-top: 24px;
  margin-left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  cursor: default;
}

.lookFail {
  width: 136px;
  height: 32px;
  border-radius: 2px;
  border: solid 1px #007aff;
  color: #007aff;
  margin-top: 24px;
  margin-left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  cursor: pointer;
}
.lookFail:hover {
  background-color: #007aff;
  color: #fff;
  border: none;
  outline: none;
}
.lookFail:focus {
  outline: none !important;
}
.content {
  width: 100%;
  text-align: center;
  color: #151515;
  span.iconfont.iconziyuan13 {
    font-size: 24px;
    color: #ffb100;
    margin-top: -5px;
    height: 24px;
    margin-bottom: 20px;
    float: left;
  }
  .iconfont-text {
    margin-left: 40px;
    text-align: left;
  }
  p {
    line-height: 24px;
    margin-bottom: 0 !important;
  }
  .second-p {
    text-indent: 2em;
  }
  .section {
    margin-top: 24px;
  }
  .p1 {
    margin-bottom: 8px;
    height: 14px;
    line-height: 14px;
  }
  .p2 {
    margin-bottom: 24px;
    height: 14px;
    line-height: 14px;
  }
}
.submit-margin {
  margin-top: 16px;
}
.center-txt {
  text-align: center;
  color: #151515;
  font-size: 14px;
}
.uploadGif {
  border-radius: 2px;
  border: solid 1px #007aff;
}

@media screen and(min-width: 1280px) {
  .management {
    margin-bottom: 48px;
  }
}
.en .single-register {
  width: 190px !important;
}
.en .download {
  width: 190px !important;
}
.en .bulk-register {
  width: 190px !important;
}
.en .pagination {
  left: 240px;
  width: calc(100% - 240px);
}
.en .content .p1 {
  margin-bottom: 22px;
  line-height: 16px !important;
}
.en .p2 {
  line-height: 16px !important;
}
.en .lookFail,
.en .loading {
  width: 180px !important;
}
</style>
