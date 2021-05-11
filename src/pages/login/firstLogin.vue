<template>
<!-- 第一次登陆 设置密码页面 -->
  <div class="first-login">
    <background>
      <div
        slot="form"
        class="form"
        :class="{ en: $store.state.language === 'en_US' }"
      >
        <div class="form-title">{{ $t("firstLogin.setPwd") }}</div>
        <a-form
          class="firstLogin"
          :form="form"
          @submit="handleSubmit"
          :hideRequiredMark="true"
          labelAlign="left"
        >
          <a-form-item :label="accountLabel">
            <span class="admin">Admin</span>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" :label="pwdLabel" class="lefta">
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: requireMessage,
                    },
                    {
                      pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,8}$/,
                      message: pwdMsg,
                    },
                    {
                      validator: validateToNextPassword,
                    },
                  ],
                  validateTrigger: 'blur',
                },
              ]"
              type="password"
            />
            <span class="tip">{{ $t("firstLogin.pwdValidMsg") }}</span>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            :label="confirmLabel"
            class="lefta"
          >
            <a-input
              v-decorator="[
                'confirm',
                {
                  rules: [
                    {
                      required: true,
                      message: inconsistentPwd,
                    },
                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                  validateTrigger: 'blur',
                },
              ]"
              type="password"
              @blur="handleConfirmBlur"
            />
          </a-form-item>
          <a-button block type="primary" class="btn" html-type="submit">
            {{ $t("firstLogin.confirm") }}
          </a-button>
        </a-form>
        <a-modal
          :title="modalTitle"
          :visible="flag"
          :centered="true"
          :closable="false"
          :width="350"
        >
          <template slot="footer">
            <a-button
              key="submit"
              html-type="submit"
              type="primary"
              @click="toLogin"
              class="new-modal-submit"
            >
              {{ this.$t("basicSettings.rebootConfirm") }}
            </a-button>
            <a-button key="back" @click="cancelModal" class="new-modal-cancel">
              {{ this.$t("basicSettings.rebootCancel") }}
            </a-button>
          </template>
          <div class="content">
            <p>{{ this.$t("firstLogin.notice") }}</p>
          </div>
        </a-modal>
      </div>
    </background>
  </div>
</template>

<script>
import Background from "./childComponents/background";
export default {
  name: "firstLogin",
  data() {
    return {
      confirmDirty: false,
      flag: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },
  mounted() {
    this.getLanguage();
    this.checkHasPwd();
  },
  computed: {
    accountLabel: function () {
      return this.$t("firstLogin.accountName");
    },
    modalTitle: function () {
      return this.$t("firstLogin.modalTitle");
    },
    pwdLabel: function () {
      return this.$t("firstLogin.pwdLabel");
    },
    requireMessage: function () {
      return this.$t("firstLogin.required");
    },
    pwdMsg: function () {
      return this.$t("firstLogin.pwdMsg");
    },
    confirmLabel: function () {
      return this.$t("firstLogin.confirmLabel");
    },
    inconsistentPwd: function () {
      return this.$t("firstLogin.inconsistentPwd");
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    // 跳转登陆页面
    toLogin() {
      this.flag = false;
      this.$router.push("/login");
    },
    // 取消modal框
    cancelModal() {
      this.flag = false;
    },
    // 校验是否已经设置过密码
    checkHasPwd() {
      this.$axios.get("checkAdmin").then((res) => {
        if (res.data.retCode === -1) {
          this.$router.push("/login");
        }
      });
    },
    // 获取当前语言
    getLanguage() {
      this.$axios.get("getLanguage").then((res) => {
        if (res.data.retCode === 0) {
          let info = res.data.info;
          this.$i18n.locale = info.lang === "zh_CN" ? "zh" : "en";
          this.$store.commit("setLanguage", info.lang);
        }
      });
    },
    // 确认设置密码
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          const _this = this;
          this.$axios
            .patch("resetAdminPassword", {
              accountName: "Admin",
              accountPassword: values.password,
            })
            .then((res) => {
              if (res.data.retCode === 0) {
                _this.$router.replace("/login");
              } else if (res.data.retCode === -1) {
                this.flag = true;
              }
            });
        }
      });
    },
    // 输入框blur
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    // 校验密码
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("密码不一致");
      } else {
        callback();
      }
    },
    // 第二次校验密码
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
  },
  components: {
    Background,
  },
};
</script>

<style lang="less" scoped>
.first-login {
  width: 100%;
  height: 100%;
  .form {
    padding: 40px;
    position: absolute;
    top: calc(20% + 70px);
    left: 50%;
    transform: translateX(-50%);
    width: 466px;
    height: 388px;
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    .content {
      text-align: center !important;
      margin-bottom: 24px;
    }
    .form-title {
      font-weight: 700;
      font-size: 32px;
      color: #007aff;
      margin-bottom: 32px;
      line-height: 32px;
    }
    .tip {
      font-size: 12px;
      line-height: 12px;
      color: #a5a5a5;
      display: inline-block;
      margin-top: 8px;
    }
    .btn {
      position: absolute;
      bottom: 40px;
      width: 386px;
      left: 40px;
    }
  }
}
.content {
  text-align: center !important;
  margin-bottom: 24px;
}
.first-login .form.en {
  width: 467px;
}
</style>
