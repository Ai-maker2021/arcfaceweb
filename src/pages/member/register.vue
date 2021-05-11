<template>
<!-- 人员注册 -->
  <div class="register">
    <top-bar>
      <div slot="top-content" class="top">
        <span class="back iconfont iconziyuan11" @click="handleBack"></span>
        <span>{{ $t("register.manage") }}</span>
        <span class="next iconfont iconziyuan12"></span>
        <span>{{ $t("register.register") }}</span>
      </div>
    </top-bar>
    <div class="register-content">
      <div class="form">
        <a-form
          class="register-form"
          :form="form"
          @submit="handleSubmit"
          :hideRequiredMark="true"
          labelAlign="left"
        >
          <a-form-item :label="nameLabel" class="name toRight">
            <a-input
              v-decorator="[
                'userName',
                {
                  rules: [{ required: true, message: requireMessage }],
                  validateTrigger: 'blur',
                  initialValue: initialName,
                },
              ]"
              :placeholder="namePlaceholder"
              :maxLength="30"
            >
            </a-input>
          </a-form-item>
          <a-form-item :label="IDLabel" class="id toRight">
            <a-input
              :class="{ wrong: haveExit }"
              @change="idChange"
              v-decorator="[
                'userId',
                {
                  rules: [{ required: true, message: requireMessage }],
                  validateTrigger: 'blur',
                  initialValue: initialId,
                },
              ]"
              :placeholder="IDPlaceholder"
              :maxLength="30"
              :disabled="initialId ? true : false"
            >
            </a-input>
            <span class="haveExit" v-show="haveExit">{{
              $t("register.IDExit")
            }}</span>
          </a-form-item>
          <a-form-item :label="photoLabel" class="photo toRight">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              :beforeUpload="beforeUpload"
              @change="handleChange"
              :remove="removePhoto"
              accept=".jpg,.jpeg,.png"
              :customRequest="customRequest"
              v-decorator="[
                'photo',
                {
                  rules: [{ required: true, message: requireMessage }],
                  validateTrigger: 'blur',
                  initialValue: fileList[0],
                },
              ]"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  {{ $t("register.uploadPhoto") }}
                </div>
              </div>
            </a-upload>
            <span class="tip">{{ $t("register.uploadTip") }}</span>
            <a-modal
              :destroyOnClose="true"
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
            >
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-form-item>
          <a-form-item label=" " :colon="false">
            <a-button
              class="button"
              type="primary"
              html-type="submit"
              :loading="loading"
            >
              {{ $t("register.registerNow") }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <!-- 失败modal -->
    <a-modal
      :visible="failMessageVisible"
      :centered="true"
      :closable="false"
      :width="288"
      :footer="null"
      class="registerFail"
    >
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div>{{ errorMsg }}</div>
      </div>
    </a-modal>
    <!-- 成功modal -->
    <a-modal
      :visible="successMessageVisible"
      :centered="true"
      :closable="false"
      :width="182"
      :footer="null"
      class="registerSuccess"
    >
      <div class="content">
        <span class="iconfont iconziyuan2"></span>
        <div>{{ $t("register.registerOk") }}</div>
      </div>
    </a-modal>
  </div>
</template>
<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import TopBar from "@/components/topBar/topBar";
export default {
  data() {
    return {
      previewVisible: false,
      previewImage: "",
      fileList: [],
      photoMsg: "",
      photoOk: false, //图片检验是否成功
      isUpdatePhoto: false,
      loading: false,
      successMessageVisible: false,
      failMessageVisible: false,
      initialName: "",
      initialId: "",
      errorMsg: "",
      haveExit: false,
      faceId: 0, //需要修改的人脸ID
    };
  },
  name: "register",
  components: {
    TopBar,
  },
  computed: {
    nameLabel: function () {
      return this.$t("register.nameLabel");
    },
    requireMessage: function () {
      return this.$t("register.required");
    },
    namePlaceholder: function () {
      return this.$t("register.namePlaceholder");
    },
    IDLabel: function () {
      return this.$t("register.IDLabel");
    },
    IDPlaceholder: function () {
      return this.$t("register.IDPlaceholder");
    },
    photoLabel: function () {
      return this.$t("register.photoLabel");
    },
  },
  mounted() {
    this.getInitialData();
  },
  updated() {},
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    // 提交信息
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // 如果是新人员注册
          if (!this.$route.params.id) {
            // 判断是否存在此人员id
            this.loading = true;
            this.$axios
              .patch("getPersonByPersonNumber", {
                personNumber: values.userId,
              })
              .then((res) => {
                this.loading = false;
                // 如果人员信息不为空
                if (res.data.retCode === 0) {
                  if (JSON.stringify(res.data.info) !== "{}") {
                    this.haveExit = true;
                  } else {
                    this.register(values);
                  }
                }
              });
          } else {
            this.register(values);
          }
        }
      });
    },
    // 点击注册
    register(values) {
      this.loading = true;
      const _this = this;
      const formData = new FormData();
      formData.append("personName", values.userName);
      formData.append("personNumber", values.userId);
      if (this.$route.params.id) {
        formData.append("faceId", this.faceId);
        if (!this.isUpdatePhoto) {
          formData.append("updateImage", 0);
        } else {
          formData.append("updateImage", 1);
          formData.append("picture", values.photo.file.originFileObj);
        }
      } else {
        formData.append("picture", values.photo.file.originFileObj);
        formData.append("updateImage", 1);
      }
      this.$axios.post("singlePersonRegister", formData).then((res) => {
        _this.loading = false;
        if (res.data.retCode === 0) {
          if (this.$route.params.id) {
            _this.$router.push(
              "/member/management/lookover/" + this.$route.params.id
            );
          }
          _this.form.setFieldsValue({
            userName: null,
            userId: null,
            photo: null,
          });
          _this.fileList = [];

          this.$message.destroy();
          this.$message.success(this.$t("register.registerOk"));
        } else {
          this.$message.destroy();
          this.$message.error(res.data.info.message);
        }
      });
    },
    // 监听id是否改变
    idChange() {
      this.haveExit = false;
    },
    // 回去人员查看页面
    handleBack() {
      this.$router.go(-1);
    },
    // 取消注册
    handleCancel() {
      this.previewVisible = false;
    },
    // 预览图片
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 自定义设置upload上传事件
    customRequest(options) {
      const { onSuccess, file, onProgress } = options;
      onProgress();
      const reader = new FileReader();
      reader.readAsDataURL(file); // input.files[0]为第一个文件
      reader.onload = (e) => {
        this.fileList = [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            type: "image/png",
            url: e.target.result,
          },
        ];
        onSuccess();
      };
    },
    // 监听图片改变
    handleChange({ file, fileList }) {
      if (this.photoOk) {
        this.$nextTick(() => {
          this.form.validateFields(["photo"]);
        });
      } else {
        this.$nextTick(() => {
          this.form.setFields({
            photo: { value: null, errors: [new Error(this.photoMsg)] },
          });
        });
      }
    },
    // 图片上传完成之前
    beforeUpload(file) {
      this.photoMsg = "";
      let isok = true;
      const isImg = file.type.includes("image/");
      if (!isImg) {
        this.fileList = [];
        this.photoMsg = this.$t("register.onlyPhoto");
        isok = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        this.photoMsg = this.$t("register.tooLarge");
        isok = false;
      }
      const isBt5K = file.size / 1024 > 5;
      if (!isBt5K) {
        this.photoMsg = this.$t("register.tooSmall");
        isok = false;
      }
      this.photoOk = isok;
      return isok;
    },
    // 移除图片
    removePhoto() {
      this.fileList = [];
      this.photoMsg = this.$t("register.required");
      this.photoOk = false;
      this.isUpdatePhoto = true;
    },
    // 获取默认人员信息
    getInitialData() {
      if (this.$route.params.id) {
        this.$axios
          .patch("getPersonById", {
            id: parseInt(this.$route.params.id),
          })
          .then((res) => {
            if (res.data.retCode === 0) {
              let personInfo = res.data.info["personInfo"];
              this.initialName = personInfo.personName;
              this.initialId = personInfo.personNumber;
              this.faceId = personInfo.faceInfo[0].faceId;
              this.fileList = [
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  type: "image/png",
                  url: personInfo.faceInfo[0].imagePath || "",
                },
              ];
            }
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register {
  .top {
    height: 47px;
    line-height: 47px;
    span {
      display: inline-block;
    }
    .back {
      margin-right: 8px;
      cursor: pointer;
    }
    .refresh {
      margin-right: 32px;
      cursor: pointer;
    }
    .next {
      margin: 0 4px;
    }
  }
  .register-content {
    padding: 88px 0 0 80px;
    .tip {
      color: #a5a5a5;
      font-size: 12px;
      display: inline-block;
      height: 12px;
      line-height: 12px;
      left: 112px;
      top: 83px;
      width: 180px;
      position: absolute;
    }
    .button {
      width: 80px;
      height: 32px;
      border-radius: 2px;
      margin-top: 32px;
      padding: 0;
    }
    .photoMsg {
      margin-top: 5px;
      display: block;
      line-height: 16px !important;
      min-height: 16px !important;
      color: #e83021 !important;
      font-size: 12px !important;
      background: url("../../../src/assets/images/login/error.png") top left
        no-repeat;
      padding-left: 20px;
    }
  }
}

.content {
  display: flex;
  justify-content: space-between;
  .iconziyuan13 {
    font-size: 24px;
    color: #ffb100;
    margin-right: 16px;
    display: inline-block;
    margin-top: -5px;
    height: 24px;
  }
  .iconziyuan2 {
    font-size: 24px;
    color: #8ed900;
    margin-right: 16px;
    display: inline-block;
    margin-top: -5px;
    height: 24px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.haveExit {
  color: #e83021;
  background: url("../../assets/images/login/error.png") top left no-repeat;
  padding-left: 20px;
  font-size: 12px !important;
  line-height: 16px !important;
  min-height: 16px !important;
  position: absolute !important;
  top: 2px;
  left: 248px;
  width: 200px;
}
.en .haveExit {
  color: #e83021;
  background: url("../../assets/images/login/error.png") top left no-repeat;
  padding-left: 20px;
  font-size: 12px !important;
  line-height: 16px !important;
  min-height: 16px !important;
  position: absolute !important;
  top: 2px;
  left: 248px;
  width: 200px;
  margin-left: 35px;
}

.wrong {
  border-color: #e83021 !important;
}
.en .register .register-content .button {
  width: 150px !important;
}
</style>
