<template>
<!-- 离线激活 -->
  <div class="offlineactive" :class="{ en: $store.state.language === 'en_US' }">
    <!-- 激活步骤 -->
    <div class="Activation">
      <div class="Activation-steps">
        <p style="margin-left: 10px; font-weight: 900">
          {{ $t("offlineActive.activationstep") }}
        </p>
      </div>

      <div class="Actionfather">
        <!-- 第一步 -->
        <div class="Activation-txt">
          <p style="margin-top: 15px">{{ $t("offlineActive.firststep") }}</p>
          <div><img src="@/assets/images/equipment/1.png" alt="" /></div>
          <a-button type="primary" class="button" @click="getdeviceInformation">
            {{ $t("offlineActive.collectdevice") }}
          </a-button>
        </div>
        <span>
          <i class="iconfont iconjiantou"></i>
        </span>
        <!-- 第二步 -->
        <div class="Activation-txt">
          <p style="margin-top: 15px">{{ $t("offlineActive.secondstep") }}</p>
          <img src="@/assets/images/equipment/2.png" alt="" />
          <div style="margin-top: 30px">
            <span>{{ $t("offlineActive.vender") }}</span>
          </div>
          <div>
            <span style="margin-top: 1px">{{
              $t("offlineActive.devicefile")
            }}</span>
          </div>
          <div>
            <span style="margin-top: 1px">{{
              $t("offlineActive.offlinefile")
            }}</span>
          </div>
        </div>
        <span>
          <i class="iconfont iconjiantou"></i>
        </span>
        <!-- 第三步 -->
        <div class="Activation-txt">
          <p style="margin-top: 15px">{{ $t("offlineActive.thirdstep") }}</p>
          <div><img src="@/assets/images/equipment/3.png" alt="" /></div>
          <!-- <a-upload :file-list="pathFile" @change="handleChange" > -->
          <a-upload
            :file-list="pathFile"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-button type="primary" class="button" style="width: 180px">
              {{ $t("offlineActive.usingofflinefile") }}
            </a-button>
          </a-upload>
        </div>
      </div>
    </div>
    <!-- 激活状态 其他v-if="flag" -->
    <div class="Activestate">
      <div class="Activation-txte">
        <p style="margin-left: 10px; font-weight: 900">
          {{ $t("offlineActive.activestate") }}
        </p>
      </div>

      <div class="activeform">
        <!-- class="offline" -->
        <a-form
          labelAlign="left"
          class="warmthSettings"
          :hideRequiredMark="true"
          :labelCol="{ span: 10 }"
          :wrapperCol="{ span: 25 }"
          style="margin-left: 90px; margin-top: 50px"
        >
          <!-- 再次激活 -->
          <a-form-item :label="activateagainLabel" class="bottom24">
            <a-button
              class="activeBtn"
              type="primary"
              @click="handsecondavtive"
            >
              {{ $t("offlineActive.activateagaintxt") }}</a-button
            >
          </a-form-item>
          <!-- 导出离线激活文件 -->
          <a-form-item :label="exportfileLabel" class="bottom24">
            <a-button
              class="activeBtn"
              type="primary"
              @click="getdownloadActivationOfflineFile"
            >
              {{ $t("offlineActive.exportfiletxt") }}</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "offineactive",
  data() {
    return {
      file: "",
      size: "",
      pathFile: [],
      filetxt: "",
    };
  },
  beforeCreate() {},
  computed: {
    offlineactivationLabel: function () {
      return this.$t("offlineActive.offlineactivationLabel");
    },
    activateagainLabel: function () {
      return this.$t("offlineActive.activateagainLabel");
    },
    exportfileLabel: function () {
      return this.$t("offlineActive.exportfileLabel");
    },
  },
  mounted() {},
  methods: {
    //下载设备采集信息
    getdeviceInformation() {
      this.$axios
        .get("getFingerPrint")
        .then((res) => {
          if (res.data.retCode === 0) {
            this.fileName = res.data.info.fileName;
            let blob = new Blob([res.data.info.file], {
              type: "application/plain",
            });
            let fileName = this.fileName;
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = decodeURI(fileName); //下载后文件名
            document.body.appendChild(downloadElement);
            if (navigator.msSaveOrOpenBlob) {
              //兼容IE
              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //导出离线激活文件
    getdownloadActivationOfflineFile() {
      this.$axios
        .get("downloadActivationOfflineFile")
        .then((res) => {
          if (res.data.retCode === 0) {
            this.file = res.data.info.file;
            this.fileName = res.data.info.fileName;
            let blob = new Blob([res.data.info.file], {
              type: "application/plain",
            });
            let fileName = this.fileName;
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = decodeURI(fileName); //下载后文件名
            document.body.appendChild(downloadElement);
            if (navigator.msSaveOrOpenBlob) {
              //兼容IE
              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
            }
          } else if (res.data.retCode === -1) {
            this.$message.error(this.$t("offlineActive.nonetxt"));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    beforeUpload(file) {
      this.file = file;
      return false;
    },
    // 上传 使用离线激活文件激活
    handleChange(file) {
      this.file = file;
      const isDat = file.file.name.includes("dat");
      const size = file.file.size / 1024;
      if (!isDat) {
        this.$message.error(this.$t("offlineActive.onlydat"));
        return false;
      } else if (size > 4) {
        this.$message.error(this.$t("offlineActive.maxtxt"));
        return false;
      } else {
        let formData = new FormData();
        formData.append("file", this.file.file);
        this.$axios.post("offlineActivate", formData).then((res) => {
          if (res.data.retCode === 0) {
            this.$message.success(this.$t("offlineActive.activeOk"));
          } else if (res.data.retCode < 0) {
            this.$message.error(res.data.info.message);
          } else {
          }
        });
      }
    },
    //使用本地已有离线激活文件再次激活   1100 1101
    handsecondavtive() {
      this.$axios.post("activateWithLocalActivationOfflineFile").then((res) => {
        if (res.data.retCode === 0) {
          this.$message.success(this.$t("offlineActive.activeOk"));
        } else if (res.data.retCode === -3) {
          this.$message.error(res.data.info.message);
        } else {
          this.$message.destroy();
          this.$message.error(this.$t("offlineActive.nonetxt"));
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.offlineactive {
  .Activation {
    .Activation-steps {
      margin-left: 20px;
      border-bottom: 1px solid rgba(0, 122, 255, 0.24);
      margin-top: 10px;
      margin-right: 20px;
    }
    .Actionfather {
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        width: 29px;
        height: 28px;
        font-size: 20px;
        margin-left: 55px;
        color: rgba(0, 122, 255, 0.24);
      }
      .Activation-txt {
        margin-top: 50px;
        margin-left: 60px;
        float: left;
        width: 240px;
        height: 320px;
        border: 1px solid rgba(0, 122, 255, 0.24);
        border-radius: 8px;
        text-align: center;
        img {
          margin-top: 50px;
          margin-left: -20px;
        }
        .button {
          border-radius: 2px;
          margin-top: 45px;
          width: 160px;
        }
      }
    }
  }
  .Activestate {
    margin-left: 20px;
    margin-top: 50px;
    margin-right: 20px;
    margin-bottom: 100px;
    .Activation-txte {
      border-bottom: 1px solid rgba(0, 122, 255, 0.24);
    }
    .activeform {
      .activeBtn {
        border-radius: 2px;
        color: #007aff !important;
        background-color: #fff !important;
        width: 243px;
      }
    }
  }
}
</style>
