<template>
<!-- 登录 -->
  <div class="login-spin-content">
    <a-spin v-if="flag">
      <div class="login">
        <background>
          <div slot="form" class="form">
            <div class="form-title">{{ $t("login.welcome") }}</div>
            <a-form
              :class="{ en: $store.state.language === 'en_US' }"
              id="components-form-demo-normal-login"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
              :hideRequiredMark="true"
              labelAlign="left"
            >
              <a-form-item :label="usernameLabel" class="username">
                <a-input
                  v-decorator="[
                    'accountName',
                    {
                      rules: [{ required: true, message: requireMessage }],
                      validateTrigger: 'blur',
                      initialValue: initialUsername,
                    },
                  ]"
                  :maxLength="30"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                :label="pwdLabel"
                class="password"
                :class="{ help: pwdMsg !== '' }"
              >
                <a-input
                  v-decorator="[
                    'accountPwd',
                    {
                      rules: [{ required: true, message: requireMessage }],
                      validateTrigger: 'blur',
                      initialValue: initialPwd,
                    },
                  ]"
                  type="password"
                  @change="handlePasswordChange"
                >
                </a-input>
                <span class="pwdMsg" v-if="pwdMsg && pwdMsg !== ''">{{
                  pwdMsg
                }}</span>
              </a-form-item>
              <a-form-item label=" " :colon="false" class="remember">
                <a-checkbox
                  v-decorator="[
                    'remember',
                    {
                      valuePropName: 'checked',
                      initialValue: initialPwd ? true : false,
                    },
                  ]"
                >
                  {{ this.$t("login.remember") }}
                </a-checkbox>
              </a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                class="login-form-button"
              >
                {{ this.$t("login.login") }}
              </a-button>
            </a-form>
          </div>
        </background>
      </div>
    </a-spin>

    <div v-else class="login">
      <background>
        <div slot="form" class="form">
          <div class="form-title">{{ $t("login.welcome") }}</div>
          <a-form
            :class="{ en: $store.state.language === 'en_US' }"
            id="components-form-demo-normal-login"
            :form="form"
            class="login-form"
            @submit="handleSubmit"
            :hideRequiredMark="true"
            labelAlign="left"
          >
            <a-form-item :label="usernameLabel" class="username">
              <a-input
                v-decorator="[
                  'accountName',
                  {
                    rules: [{ required: true, message: requireMessage }],
                    validateTrigger: 'blur',
                    initialValue: initialUsername,
                  },
                ]"
                :maxLength="30"
              >
              </a-input>
            </a-form-item>
            <a-form-item
              :label="pwdLabel"
              class="password"
              :class="{ help: pwdMsg !== '' }"
            >
              <a-input
                v-decorator="[
                  'accountPwd',
                  {
                    rules: [{ required: true, message: requireMessage }],
                    validateTrigger: 'blur',
                    initialValue: initialPwd,
                  },
                ]"
                type="password"
                @change="handlePasswordChange"
              >
              </a-input>
              <span class="pwdMsg" v-if="pwdMsg && pwdMsg !== ''">{{
                pwdMsg
              }}</span>
            </a-form-item>
            <a-form-item label=" " :colon="false" class="remember">
              <a-checkbox
                v-decorator="[
                  'remember',
                  {
                    valuePropName: 'checked',
                    initialValue: initialPwd ? true : false,
                  },
                ]"
              >
                {{ this.$t("login.remember") }}
              </a-checkbox>
            </a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button"
            >
              {{ this.$t("login.login") }}
            </a-button>
          </a-form>
        </div>
      </background>
    </div>
  </div>
</template>

<script>
import router from "@/router/index.js";
import Background from "./childComponents/background";
import Cookies from "js-cookie";
const RoleManagement = () => import("@/pages/account/role-management");
const Layout = () => import("@/layout/layout.vue");
export default {
  name: "login",
  data() {
    return {
      timer: null,
      flag: false,
      pwdMsg: "",
      initialUsername: "",
      initialPwd: "",
    };
  },
  computed: {
    usernameLabel: function () {
      return this.$t("login.usernameLabel");
    },
    requireMessage: function () {
      return this.$t("login.required");
    },
    pwdLabel: function () {
      return this.$t("login.pwdLabel");
    },
  },
  components: {
    Background,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  created() {
    this.initialUsername = Cookies.get("username");
    this.initialPwd = Cookies.get("pwd");
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    // 获取语言
    getLanguage() {
      this.$axios
        .get("getLanguage")
        .then((res) => {
          if (res.data.retCode === 0) {
            this.flag = false;
            let info = res.data.info;
            this.$i18n.locale = info.lang === "zh_CN" ? "zh" : "en";
            this.$store.commit("setLanguage", info.lang);
          }
        })
        .catch((error) => {
          console.log(error);
          this.flag = true;
          this.timer = setTimeout(() => {
            this.getLanguage();
          }, 10000);
        });
    },
    // 确认登录
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.remember) {
            Cookies.set("username", values.accountName, {
              expires: 2147483647,
            });
            Cookies.set("pwd", values.accountPwd, { expires: 2147483647 });
          } else {
            Cookies.set("username", "", { expires: 2147483647 });
            Cookies.set("pwd", "", { expires: 2147483647 });
          }
          const _this = this;
          this.$axios
            .patch("login", {
              accountName: values.accountName,
              accountPassword: values.accountPwd,
            })
            .then((res) => {
              if (res.data.retCode === 0) {
                if (res.data.info.menu.length === 0) {
                  _this.$message.error(this.$t("login.noAuth"));
                } else {
                  if (res.data.info.menu[0].submenu.length > 0) {
                    _this.$router.replace(
                      res.data.info.menu[0].submenu[0].path
                    );
                  } else {
                    _this.$router.replace(res.data.info.menu[0].name);
                  }
                }

                _this.$store.dispatch("setUsername", res.data.info.accountName);
                _this.$store.dispatch("setRolename", res.data.info.roleName);
                _this.$store.dispatch("setAccountId", res.data.info.accountId);
                _this.$store.dispatch("setMenuList", res.data.info.menu);
              } else if (res.data.retCode === -1) {
                if (values.accountPwd !== "") {
                  _this.pwdMsg = this.$t("login.usernameOrPwdWrong");
                }
              }
            });
        }
      });
    },
    // 密码改变
    handlePasswordChange() {
      this.pwdMsg = "";
    },
    // 校验密码
    checkPsd() {
      this.$axios
        .get("checkAdmin")
        .then((res) => {
          if (res.data.retCode === 0) {
            this.flag = false;
            this.$router.push("/firstLogin");
          }
        })
        .catch((error) => {
          this.flag = true;
          this.timer = setTimeout(() => {
            this.checkPsd();
          }, 10000);
        });
    },
  },
  mounted() {
    this.getLanguage();
    this.checkPsd();
    // 把用户名、密码存入cookie
    const username = Cookies.get("username");
    const pwd = Cookies.get("pwd");
    if (username !== undefined && pwd !== undefined) {
      this.initialUsername = username;
      this.initialPwd = pwd;
    }
  },
};
</script>

<style lang="less" scoped>
.login-spin-content {
  width: 100%;
  height: 100%;
  .ant-spin-nested-loading {
    width: 100%;
    height: 100%;
  }
  .login {
    width: 100%;
    height: 100%;
    .form {
      padding: 40px;
      position: absolute;
      top: calc(20% + 70px);
      left: 50%;
      transform: translateX(-50%);
      width: 452px;
      height: 352px;
      background-color: #ffffff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      .form-title {
        font-weight: 700;
        font-size: 32px;
        color: #007aff;
        margin-bottom: 32px;
        line-height: 32px;
      }
      .login-form-button {
        position: absolute;
        width: 372px;
        bottom: 40px;
      }
      .pwdMsg {
        margin-top: 6px;
        color: #e83021;
        display: inline-block;
        background: url("../../assets/images/login/error.png") center left
          no-repeat;
        padding-left: 16px;
        font-size: 12px;
      }
    }
  }
}
</style>
