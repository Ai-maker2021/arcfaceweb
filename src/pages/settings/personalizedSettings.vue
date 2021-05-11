<template>
  <!-- 个性化设置 -->
  <div>
    <a-form
      labelAlign="left"
      :form="form"
      class="personalized-settings"
      @submit="handleSubmit"
      :hideRequiredMark="true"
    >
      <title-bar :title="showSettingsTitle" />
      <div class="form-content show">
        <a-form-item
          :label="subscriptLabel"
          class="subscript toRight height52 bottom24"
        >
          <a-input
            style="width: 275px"
            v-decorator="[
              'subtitle',
              {
                validateTrigger: 'blur',
              },
            ]"
            :maxLength="30"
          />
          <span class="tip">{{ $t("personalizedSettings.subtitleTip") }}</span>
        </a-form-item>
        <a-form-item label="LOGO" class="logo height52 bottom24 toRight photo">
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            :before-upload="beforeUpload"
            @change="handleFileChange"
            :remove="removePhoto"
            accept=".jpg,.jpeg,.png"
            :customRequest="customRequest"
            class="logo-cont"
            v-decorator="[
              'logoPath',
              {
                rules: [
                  {
                    validator: photoValidator,
                  },
                ],
                validateTrigger: 'blur',
                initialValue: fileList[0],
              },
            ]"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                {{ $t("personalizedSettings.uploadPhoto") }}
              </div>
            </div>
          </a-upload>

          <span
            class="photoMsg"
            v-if="photoMsg && photoMsg !== ''"
            style="color: red"
            >{{ photoMsg }}</span
          >
          <span class="tip left" v-else>{{
            $t("personalizedSettings.photoTip")
          }}</span>
          <a-modal
            :destroyOnClose="true"
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </div>
      <title-bar :title="recognizeOk" class="subTop" />
      <div class="form-content">
        <a-form-item
          :label="successPopupsLabel"
          class="toRight radioLabel voice subTop76 height71 right84 bottom24"
        >
          <a-radio-group
            v-decorator="[
              'successMode',
              {
                rules: [
                  {
                    required: true,
                    message: requireMessage,
                  },
                ],
              },
            ]"
          >
            <a-radio :value="1">
              {{ $t("personalizedSettings.successMode1") }}
            </a-radio>
            <a-radio :value="2">
              {{ $t("personalizedSettings.successMode2") }}
            </a-radio>
            <a-radio :value="3"> </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="toRight success-user-dinfined wid254">
          <a-input
            :disabled="successUserDefinedDisabled"
            v-decorator="[
              'successCustomContent',
              {
                rules: [
                  {
                    validator: successUserDinfinedValidator,
                  },
                ],
                // validateTrigger: 'blur',
              },
            ]"
            :placeholder="userDefinePlaceholder"
            :maxLength="maxLength"
          />
        </a-form-item>
        <a-form-item
          :label="successVoiceLabel"
          class="toRight voice subTop15 height84 bottom24"
        >
          <a-switch
            class="switch"
            v-decorator="['successVoiceMode', { valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item class="toRight success-voice max">
          <a-radio-group
            :disabled="successVoiceDisabled"
            v-decorator="[
              'successVoiceModeMethod',
              {
                rules: [
                  {
                    validator: successVoiceValidator,
                  },
                ],
              },
            ]"
          >
            <a-radio :value="1">
              {{ $t("personalizedSettings.successVoiceModeMethod1") }}
            </a-radio>
            <span>
              <a-radio :value="2">
                {{ $t("personalizedSettings.successVoiceModeMethod2") }}
              </a-radio>
            </span>
            <span>
              <a-radio :value="3">
                {{ $t("personalizedSettings.successVoiceModeMethod3") }}
              </a-radio>
            </span>
            <a-radio :value="4">
              {{ $t("personalizedSettings.successVoiceModeMethod4") }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div class="sketch">
          <img
            src="@/assets/images/settings/example.png"
            v-if="$store.state.language === 'zh_CN'"
            alt=""
          />
          <img
            src="@/assets/images/settings/example-en.png"
            v-if="$store.state.language === 'en_US'"
            alt=""
          />
        </div>
      </div>
      <title-bar :title="recognizeFail" class="subTop" />
      <div class="form-content">
        <a-form-item
          :label="failPopupsLabel"
          class="toRight voice subTop15 height102 bottom24"
        >
          <a-switch
            class="switch fail-switch"
            v-decorator="['failMode', { valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item class="toRight fail-pop-up">
          <a-radio-group
            :disabled="failIdDisabled"
            v-decorator="[
              'failModeMethod',
              {
                rules: [
                  {
                    validator: FailPopUpValidator,
                  },
                ],
              },
            ]"
          >
            <a-radio :value="1" class="default">
              {{ $t("personalizedSettings.defaultMark") }}
            </a-radio>
            <a-radio :value="2"> </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="toRight fail-user-dinfined wid254">
          <!-- (failIdDisabled==false)?failUserDefinedDisabled==false? false:true:true -->
          <a-input
            :disabled="
              failIdDisabled == false
                ? failUserDefinedDisabled == false
                  ? false
                  : true
                : true
            "
            v-decorator="[
              'failCustomContent',
              {
                rules: [
                  {
                    validator: failUserDinfinedValidator,
                  },
                ],
                //validateTrigger: 'blur'
              },
            ]"
            :placeholder="customizePlaceholder"
            :maxLength="maxLength1"
          />
        </a-form-item>
        <a-form-item
          :label="failVoiceLabel"
          class="toRight voice subTop15 height84 bottom24"
        >
          <a-switch
            class="switch"
            v-decorator="['failVoiceMode', { valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item class="toRight fail-voice">
          <a-radio-group
            :disabled="failVoiceDisabled"
            v-decorator="[
              'failVoiceModeMethod',
              {
                rules: [
                  {
                    validator: failVoiceValidator,
                  },
                ],
              },
            ]"
          >
            <a-radio :value="1">
              {{ $t("personalizedSettings.failVoiceModeMethod1") }}
            </a-radio>
            <a-radio :value="2">
              {{ $t("personalizedSettings.failVoiceModeMethod2") }}
            </a-radio>
            <p>
              <a-radio :value="3">
                {{ $t("personalizedSettings.failVoiceModeMethod3") }}
              </a-radio>
            </p>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" " :colon="false" class="top64">
          <a-button
            class="btn"
            type="primary"
            html-type="submit"
            :loading="submitLoading"
          >
            {{ $t("personalizedSettings.save") }}
          </a-button>
        </a-form-item>
      </div>
    </a-form>
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
import TitleBar from "./childComponents/titleBar";
export default {
  name: "personalizedSettings",
  data() {
    return {
      submitLoading: false,
      headers: {
        authorization: "authorization-text",
      },
      photoMsg: "",
      photoOk: false, //图片检验是否成功
      successVoiceDisabled: false,
      failIdDisabled: false,
      failVoiceDisabled: false,
      failUserDefinedDisabled: true,
      successUserDefinedDisabled: true,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      maxLength: 30, // 识别成功-输入最大长度
      maxLength1: 30, // 识别失败-输入最大长度
    };
  },
  computed: {
    showSettingsTitle: function () {
      return this.$t("personalizedSettings.showSettingsTitle");
    },
    subscriptLabel: function () {
      return this.$t("personalizedSettings.subscriptLabel");
    },
    requireMessage: function () {
      return this.$t("personalizedSettings.required");
    },
    successPopupsLabel: function () {
      return this.$t("personalizedSettings.successPopupsLabel");
    },
    userDefinePlaceholder: function () {
      return this.$t("personalizedSettings.userDefinePlaceholder");
    },
    successVoiceLabel: function () {
      return this.$t("personalizedSettings.successVoiceLabel");
    },
    failPopupsLabel: function () {
      return this.$t("personalizedSettings.failPopupsLabel");
    },
    customizePlaceholder: function () {
      return this.$t("personalizedSettings.customizePlaceholder");
    },
    failVoiceLabel: function () {
      return this.$t("personalizedSettings.failVoiceLabel");
    },
    recognizeOk: function () {
      return this.$t("personalizedSettings.recognizeOk");
    },
    recognizeFail: function () {
      return this.$t("personalizedSettings.recognizeFail");
    },
  },
  components: {
    TitleBar,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "personalizedSettings",
      onValuesChange: (props, values) => {
        if (values.hasOwnProperty("successVoiceMode")) {
          this.successVoiceDisabled = !values.successVoiceMode;
        }
        if (values.hasOwnProperty("failMode")) {
          this.failIdDisabled = !values.failMode;
        }
        if (values.hasOwnProperty("failVoiceMode")) {
          this.failVoiceDisabled = !values.failVoiceMode;
        }
        if (values.hasOwnProperty("successMode")) {
          this.successUserDefinedDisabled = values.successMode !== 3;
        }
        if (values.hasOwnProperty("failModeMethod")) {
          this.failUserDefinedDisabled = values.failModeMethod !== 2;
        }
      },
    });
  },
  mounted() {
    this.getdefaultMsg();
  },
  methods: {
    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 监听文件改变
    handleFileChange({ file, fileList }) {
      if (this.photoOk) {
        this.$nextTick(() => {
          this.form.validateFields(["logoPath"]);
        });
      } else {
        this.$nextTick(() => {
          this.form.setFields({
            logoPath: { value: null },
          });
        });
      }
    },
    // 取消事件
    handleCancel() {
      this.previewVisible = false;
    },
    // 监听change
    handleChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        this.photoMsg = "";
      } else if (info.file.status === "error") {
        this.photoMsg = this.$t("personalizedSettings.uploadFail");
      }
    },
    // 单选按钮change事件
    checkRadioVal(val) {
      let newVal = -1;
      if (val === 1 || val === 2 || val === 3 || val === 4) {
        newVal = val;
      } else {
        newVal = 1;
      }
      return newVal;
    },

    // 获取接口数据
    getdefaultMsg() {
      const _this = this;
      this.$axios.get("getCustomSetInfo").then((res) => {
        if (res.data.retCode === 0) {
          _this.form.setFieldsValue({
            subtitle: this.checkStrLength(res.data.info.subtitle.trim(), 30),
            logoPath: res.data.info.logoPath,
            successMode: this.checkRadioVal(res.data.info.successMode),
            successCustomContent: this.checkStrLength(
              res.data.info.successCustomContent.trim(),
              this.maxLength
            ),
            successVoiceMode: res.data.info.successVoiceMode ? true : false,
            successVoiceModeMethod: this.checkRadioVal(
              res.data.info.successVoiceMode
            ),
            failMode: res.data.info.failMode ? true : false,
            failModeMethod: this.checkRadioVal(res.data.info.failMode),
            failCustomContent: this.checkStrLength(
              res.data.info.failCustomContent.trim(),
              this.maxLength1
            ),
            failVoiceMode: res.data.info.failVoiceMode ? true : false,
            failVoiceModeMethod: this.checkRadioVal(
              res.data.info.failVoiceMode
            ),
          });
          if (res.data.info.logoPath) {
            _this.fileList = [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                type: "image/png",
                url: res.data.info.logoPath,
              },
            ];
          }
        }
      });
    },
    // 校验传给接口的字符串长度
    checkStrLength(str, max) {
      let newStr = str && String(str).trim();
      let val = "";
      if (newStr && newStr.length > max) {
        val = newStr.substr(0, max);
      } else if (newStr && newStr.length < 0) {
        val = "";
      } else {
        val = newStr.trim();
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
          formData.append(
            "subtitle",
            this.checkStrLength(values.subtitle.trim(), 30)
          );
          if (values.logoPath) {
            if (typeof values.logoPath === "string") {
              formData.append("logoPath", values.logoPath);
              formData.append("upload", 0);
            } else {
              formData.append("logoPath", values.logoPath.file.originFileObj);
              formData.append("upload", 1);
            }
          } else {
            formData.append("logoPath", "");
            formData.append("upload", 0);
          }
          formData.append("successMode", values.successMode);
          if (+values.successMode === 3) {
            formData.append(
              "successCustomContent",
              this.checkStrLength(
                values.successCustomContent.trim(),
                this.maxLength
              )
            );
          }
          if (+values.successVoiceMode === 0) {
            formData.append("successVoiceMode", 0);
          } else {
            formData.append("successVoiceMode", values.successVoiceModeMethod);
          }

          if (!values.failMode) {
            formData.append("failMode", values.failMode ? true : 0);
          } else {
            formData.append("failMode", values.failModeMethod);
          }

          if (+values.failModeMethod === 2) {
            formData.append(
              "failCustomContent",
              this.checkStrLength(
                values.failCustomContent.trim(),
                this.maxLength1
              )
            );
          }
          if (+values.failVoiceMode === 0) {
            formData.append("failVoiceMode", 0);
          } else {
            formData.append("failVoiceMode", values.failVoiceModeMethod);
          }

          this.$axios.post("setCustomSetInfo", formData).then((res) => {
            this.submitLoading = false;
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(this.$t("personalizedSettings.settingOk"));
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },
    // 上传组件处理文件
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
    // 清空
    removePhoto() {
      this.fileList = [];
    },
    // 上传之前监听
    beforeUpload(file) {
      this.photoMsg = "";
      const isImg = file.type.includes("image/");
      this.isok = true;
      if (!isImg) {
        this.fileList = [];
        this.photoMsg = this.$t("personalizedSettings.onlyPhoto");
        this.isok = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        //照片不能大于3M
        this.photoMsg = this.$t("personalizedSettings.tooLarge");
        this.isok = false;
      }
      this.photoOk = this.isok;
      return this.isok;
    },
    // 表单校验
    successVoiceValidator(rule, value, callback) {
      if (!this.successVoiceDisabled) {
        if (!value) {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    FailPopUpValidator(rule, value, callback) {
      if (!this.failIdDisabled) {
        if (!value) {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 失败校验
    failVoiceValidator(rule, value, callback) {
      if (!this.failVoiceDisabled) {
        if (!value) {
          callback(this.requireMessage);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 判断输入值中是否有 name id
    checkString(str) {
      const arr = str.match(/\{.*?\}/g);
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          const text = arr[i].toLowerCase();
          if (text !== "{name}" && text !== "{id}") {
            return false;
          }
        }
      }
      return true;
    },
    // 成功校验
    successUserDinfinedValidator(rule, value, callback) {
      let newVal = value.toLowerCase();
      let filterLength = newVal.replace(/\{name\}/g, "").replace(/\{id\}/g, "")
        .length;
      setTimeout(() => {
        if (!this.successUserDefinedDisabled) {
          this.maxLength = 30 + (newVal.length - filterLength);
          if (!value) {
            callback(this.requireMessage);
          } else if (!this.checkString(value)) {
            callback(this.$t("personalizedSettings.inputFormat"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }, 200);
    },
    // 失败校验
    failUserDinfinedValidator(rule, value, callback) {
      let newVal = value.toLowerCase();
      let filterLength = newVal.replace(/\{name\}/g, "").replace(/\{id\}/g, "")
        .length;
      setTimeout(() => {
        if (!this.failUserDefinedDisabled) {
          this.maxLength1 = 30 + (newVal.length - filterLength);
          if (!value) {
            callback(this.requireMessage);
          } else if (!this.checkString(value)) {
            callback(this.$t("personalizedSettings.inputFormat"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }, 200);
    },
    // 图片校验
    photoValidator(rule, value, callback) {
      if (this.fileList.length === 0) {
        callback();
      } else {
        callback();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.personalized-settings {
  padding: 16px 24px 78px 24px;
  color: #151515 !important;

  .subTop {
    margin-top: -6px;
  }
  .show.form-content {
    height: 245px;
  }
  .form-content {
    padding: 16px 0 0 64px;
    position: relative;
    .tip {
      font-size: 12px;
      line-height: 16px;
      color: #a5a5a5;
      display: inline-block;
      margin-top: 8px;
    }
    .uploadPhoto {
      width: 80px;
      height: 32px;
      border-radius: 2px;
      border: solid 1px #007aff;
      color: #007aff;
      padding: 0 12px;
    }
    .uploadPhoto:hover {
      color: #fff;
      background-color: #007aff;
    }
    input#personalizedSettings_success-user-dinfined,
    input#personalizedSettings_fail-user-dinfined {
      width: 254px !important;
      margin-left: 4px;
    }
    .btn {
      width: 80px !important;
    }
    // .last {
    //   margin-right: 0 !important;
    // }
    .sketch {
      position: absolute;
      top: 24px;
      right: 166px;
      width: 255px;
      img {
        width: 100%;
      }
    }
  }
  .toRight.success-user-dinfined.ant-row.ant-form-item {
    position: absolute !important;
    top: 48px;
    left: 190px;
  }
  .toRight.success-voice.ant-row.ant-form-item {
    position: absolute !important;
    top: 144px;
    left: 165px;
    height: 44px;
  }
  .toRight.fail-pop-up.ant-row.ant-form-item {
    position: absolute !important;
    top: 48px;
    left: 165px;
  }
  .toRight.fail-voice.ant-row.ant-form-item {
    position: absolute !important;
    top: 173px;
    left: 165px;
  }
  .toRight.fail-user-dinfined.ant-row.ant-form-item {
    position: absolute !important;
    top: 80px;
    left: 190px;
  }
  label.default.ant-radio-wrapper {
    display: block !important;
  }
}
.en .personalized-settings .toRight.success-user-dinfined.ant-row.ant-form-item,
.en .personalized-settings .toRight.fail-user-dinfined.ant-row.ant-form-item {
  left: 285px;
}
.en .personalized-settings .toRight.success-voice.ant-row.ant-form-item,
.en .personalized-settings .toRight.fail-pop-up.ant-row.ant-form-item,
.en .personalized-settings .toRight.fail-voice.ant-row.ant-form-item {
  left: 255px;
}
.en .ant-form-item .ant-switch {
  margin: 2px 0 16px;
}
</style>
