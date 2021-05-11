<template>
  <!-- 账号管理 -->
  <div class="account-management">
    <top-bar class="top" v-if="admin">
      <div slot="top-content" class="addAccount" @click="addAccount">
        <span class="iconfont iconzhuce"></span>
        {{ $t("accountManagement.addAccount") }}
      </div>
    </top-bar>
    <div class="list-content" :class="{ paddingTop24: !admin }">
      <a-table
        row-key="accountId"
        :columns="columns"
        :data-source="accountList"
        :pagination="false"
        tableLayout="fixed"
        align="center"
        :rowClassName="
          (record, index) => {
            let className = 'light-row';
            if (index % 2 === 1) className = 'dark-row';
            return className;
          }
        "
      >
        <template slot="action" slot-scope="text, record">
          <span slot="action" class="action">
            <div v-if="!admin && !adminAccount">
              <span @click="change(record)" class="change">{{
                $t("accountManagement.changePwd")
              }}</span>
            </div>
            <div v-else-if="admin">
              <div
                v-if="
                  adminAccount &&
                  record.accountName.toLowerCase() === 'Admin'.toLowerCase()
                "
              >
                <span @click="reset(record)" class="reset">{{
                  $t("accountManagement.resetPwd")
                }}</span>
              </div>
              <div
                v-if="
                  record.accountName.toLowerCase() !== 'Admin'.toLowerCase()
                "
              >
                <div
                  v-if="
                    record.accountName.toLowerCase() !==
                    $store.state.username.toLowerCase()
                  "
                >
                  <span @click="reset(record)" class="reset">{{
                    $t("accountManagement.resetPwd")
                  }}</span>
                  <a-divider type="vertical" />
                  <span @click="deleteAccount(record)" class="delete">{{
                    $t("accountManagement.delete")
                  }}</span>
                </div>
                <div v-else>
                  <span @click="reset(record)" class="reset">{{
                    $t("accountManagement.resetPwd")
                  }}</span>
                </div>
              </div>
            </div>
          </span>
        </template>
      </a-table>
    </div>
    <!-- 账号添加modal框 -->
    <a-modal
      :destroyOnClose="true"
      :title="addTitle"
      :visible="addAccountModal"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleAddOk"
          class="modal-submit"
        >
          {{ $t("accountManagement.open") }}
        </a-button>
        <a-button key="back" @click="handleAddCancel" class="modal-cancel">
          {{ $t("accountManagement.cancel") }}
        </a-button>
      </template>
      <a-form :form="form" @submit="handleAddOk" class="role-add">
        <a-form-item>
          <a-input
            v-decorator="[
              'accountName',
              {
                rules: [{ required: true, message: requireMessage }],
                validateTrigger: 'blur',
              },
            ]"
            :placeholder="accountPlaceholder"
            :maxLength="30"
          />
        </a-form-item>
        <span class="tip">{{ $t("accountManagement.pwdValidMsg") }}</span>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: requireMessage },
                  {
                    pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,8}$/,
                    message: pwdMsg,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
            :placeholder="pwdPlaceholder"
            type="password"
            :maxLength="30"
          />
        </a-form-item>
        <a-form-item>
          <a-select
            :suffixIcon="downIcon"
            v-decorator="[
              'role',
              {
                rules: [{ required: true, message: requireMessage }],
              },
            ]"
            :placeholder="rolePlaceholder"
          >
            <a-select-option
              v-for="(item, index) in roleList"
              :key="index"
              :value="item.roleId"
            >
              {{ item.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 添加成功modal框 -->
    <a-modal
      :destroyOnClose="true"
      :visible="successMessageModal"
      :centered="true"
      :closable="false"
      :width="182"
      :footer="null"
      class="registerSuccess"
    >
      <div class="resetContent">
        <span class="iconfont iconziyuan2"></span>
        <div>{{ $t("accountManagement.resetOk") }}</div>
      </div>
    </a-modal>
    <!-- 修改成功modal框 -->
    <a-modal
      :destroyOnClose="true"
      :visible="changeSuccessModal"
      :centered="true"
      :closable="false"
      :width="182"
      :footer="null"
      class="registerSuccess"
    >
      <div class="resetContent">
        <span class="iconfont iconziyuan2"></span>
        <div>{{ $t("accountManagement.changeOk") }}</div>
      </div>
    </a-modal>
    <!-- 重置modal框 -->
    <a-modal
      :class="{ en: $store.state.language === 'en_US' }"
      class="resetPwd"
      :destroyOnClose="true"
      :title="resetTitle"
      :visible="resetModal"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleResetOk"
          class="modal-submit"
        >
          {{ $t("accountManagement.reset") }}
        </a-button>
        <a-button key="back" @click="handleResetCancel" class="modal-cancel">
          {{ $t("accountManagement.cancel") }}
        </a-button>
      </template>
      <a-form :form="form" @submit="handleResetOk" class="resetPwd">
        <a-form-item class="newPwd">
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
            :placeholder="newPwdPlaceholder"
            :maxLength="30"
          />
          <span class="tip">{{ $t("accountManagement.pwdValidMsg") }}</span>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [
                  {
                    required: true,
                    message: requireMessage,
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
            :placeholder="confirmPwd2"
            :maxLength="30"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 删除modal框 -->
    <a-modal
      :destroyOnClose="true"
      :title="deleteTitle"
      :visible="deleteModal"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleDeleteOk"
          class="modal-submit"
        >
          {{ $t("accountManagement.confirm") }}
        </a-button>
        <a-button key="back" @click="handleDeleteCancel" class="modal-cancel">
          {{ $t("accountManagement.cancel") }}
        </a-button>
      </template>
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div class="p2">{{ $t("accountManagement.confirmDeleteAccount") }}</div>
      </div>
    </a-modal>
    <!-- 修改modal框 -->
    <a-modal
      class="changePwd"
      :destroyOnClose="true"
      :title="changeTitle"
      :visible="changeModal"
      :centered="true"
      :closable="false"
      :width="290"
    >
      <template slot="footer">
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          @click="handleChangeOk"
          class="modal-submit"
        >
          {{ $t("accountManagement.confirm") }}
        </a-button>
        <a-button key="back" @click="handleChangeCancel" class="modal-cancel">
          {{ $t("accountManagement.cancel") }}
        </a-button>
      </template>
      <a-form :form="form" @submit="handleChangeOk" class="role-add">
        <a-form-item>
          <a-input
            @change="oldPwdChange"
            :class="{ wrong: oldPwdWrong }"
            v-decorator="[
              'oldPassword',
              {
                rules: [
                  {
                    required: true,
                    message: requireMessage,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
            type="password"
            :placeholder="oldPwdPlaceholder"
            :maxLength="30"
          />
          <span v-show="oldPwdWrong" class="oldPwdWrong">{{
            $t("accountManagement.oldPwdWrong")
          }}</span>
        </a-form-item>
        <span class="tip">{{ $t("accountManagement.pwdValidMsg") }}</span>
        <a-form-item>
          <a-input
            v-decorator="[
              'newPassword',
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
            :placeholder="newPwdPlaceholder"
            :maxLength="30"
          />
          <span class="tip">{{ $t("accountManagement.pwdValidMsg") }}</span>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [
                  {
                    required: true,
                    message: requireMessage,
                  },

                  {
                    validator: changeCompareToFirstPassword,
                  },
                ],
                validateTrigger: 'blur',
              },
            ]"
            type="password"
            @blur="handleConfirmBlur"
            :placeholder="confirmPwd2"
            :maxLength="30"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 添加失败modal框 -->
    <a-modal
      :visible="addFailModal"
      :centered="true"
      :closable="false"
      :width="288"
      :footer="null"
      class="addFail"
    >
      <div class="addContent">
        <span class="iconfont iconziyuan13"></span>
        <div>{{ $t("accountManagement.accountExit") }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import TopBar from "@/components/topBar/topBar";
export default {
  name: "accountManagement",
  data() {
    return {
      page: 1,
      total: 0,
      roleList: [],
      accountList: [],
      admin: true, //是否为admin校色
      adminAccount: true, //是否为admin账号
      form: this.$form.createForm(this, { name: "add-account" }),
      downIcon: <span class="iconfont iconziyuan4"></span>,
      addAccountModal: false,
      resetModal: false,
      deleteModal: false,
      changeModal: false,
      successMessageModal: false,
      changeSuccessModal: false,
      confirmDirty: false,
      oldPwdWrong: false,
      currentAccount: {},
      addFailModal: false,
      deleteTitle: " ",
    };
  },
  computed: {
    columns: function () {
      return [
        {
          title: this.$t("accountManagement.index"),
          customRender: (text, record, index) =>
            `${index + 1 + (this.page - 1) * 24}`,
        },
        {
          title: this.$t("accountManagement.createTime"),
          dataIndex: "createTime",
          key: "createTime",
        },
        {
          title: this.$t("accountManagement.accountName"),
          dataIndex: "accountName",
          key: "accountName",
        },
        {
          title: this.$t("accountManagement.roleName"),
          dataIndex: "roleName",
          key: "roleName",
        },
        {
          title: this.$t("accountManagement.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ];
    },
    requireMessage: function () {
      return this.$t("accountManagement.required");
    },
    pwdMsg: function () {
      return this.$t("accountManagement.pwdMsg");
    },
    addTitle: function () {
      return this.$t("accountManagement.addTitle");
    },
    resetTitle: function () {
      return this.$t("accountManagement.resetPwd");
    },
    changeTitle: function () {
      return this.$t("accountManagement.changePwd");
    },
    confirmPwd2: function () {
      return this.$t("accountManagement.confirmPwd2");
    },
    newPwdPlaceholder: function () {
      return this.$t("accountManagement.newPwdPlaceholder");
    },
    oldPwdPlaceholder: function () {
      return this.$t("accountManagement.oldPwdPlaceholder");
    },
    accountPlaceholder: function () {
      return this.$t("accountManagement.accountPlaceholder");
    },
    pwdPlaceholder: function () {
      return this.$t("accountManagement.pwdPlaceholder");
    },
    rolePlaceholder: function () {
      return this.$t("accountManagement.rolePlaceholder");
    },
  },
  components: {
    TopBar,
  },
  mounted() {
    this.isAdmin();
    this.getAllAccount();
  },
  methods: {
    // 判断是否admin
    isAdmin() {
      var username = this.$store.state.username;
      var rolename = this.$store.state.rolename;
      if (rolename.toLowerCase() !== "Admin".toLowerCase()) {
        this.admin = false;
      } else {
        this.getAllRole();
      }
      if (username.toLowerCase() !== "Admin".toLowerCase()) {
        this.adminAccount = false;
      }
    },
    // 判断旧密码是否改变
    oldPwdChange() {
      this.oldPwdWrong = false;
    },
    handlePageChange() {},
    // 获取所有角色
    getAllRole() {
      const _this = this;
      this.$axios.get("getAllRoles").then((res) => {
        if (res.data.retCode === 0) {
          let data = res.data.info;
          for (var i = 0; i < data.length; i++) {
            var obj = { roleId: data[i].roleId, roleName: data[i].roleName };
            _this.roleList.push(obj);
          }
        }
      });
    },
    // 获取所有账号
    getAllAccount() {
      this.accountList = [];
      const _this = this;
      this.$axios.get("getAllAccounts").then((res) => {
        if (res.data.retCode === 0) {
          var list = res.data.info;
          if (!_this.admin) {
            var username = _this.$store.state.username;
            for (var item of list) {
              if (item.accountName === username) {
                if (!_this.$utils.checkDateTime(item.createTime)) {
                  item.createTime = _this.$utils.getDate(item.createTime, true);
                }
                _this.accountList.push(item);
              }
            }
          } else {
            for (let account of list) {
              if (!_this.$utils.checkDateTime(account.createTime)) {
                account.createTime = _this.$utils.getDate(
                  account.createTime,
                  true
                );
              }
              if (account.roleName.toLowerCase() === "Admin".toLowerCase()) {
                account.roleName = "Admin";
              }
            }
            _this.accountList = list;
          }
          _this.total = res.data.total;
        }
      });
    },
    // 点击添加
    addAccount() {
      this.addAccountModal = true;
    },
    // 添加
    handleAddOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const _this = this;
          this.$axios
            .patch("createAccount", {
              accountName: values.accountName,
              accountPassword: values.password,
              roleId: parseInt(values.role),
            })
            .then((res) => {
              if (res.data.retCode === 0) {
                _this.addAccountModal = false;
                _this.getAllAccount();
              } else if (res.data.retMsg === "AccountName already exists.") {
                _this.addAccountModal = false;
                _this.addFailModal = true;
                setTimeout(() => {
                  _this.addFailModal = false;
                }, 3000);
              }
            });
        }
      });
    },
    // 取消添加
    handleAddCancel(e) {
      this.addAccountModal = false;
    },
    // 点击重置
    reset(record) {
      this.currentAccount = record;
      this.resetModal = true;
    },
    // 重置密码
    handleResetOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const _this = this;
          this.$axios
            .patch("resetPassword", {
              accountId: _this.currentAccount.accountId,
              accountPassword: values.password,
            })
            .then((res) => {
              _this.currentAccount = {};
              if (res.data.retCode === 0) {
                _this.resetModal = false;
                _this.getAllAccount();
                _this.successMessageModal = true;
                setTimeout(() => {
                  _this.successMessageModal = false;
                }, 3000);
              }
            });
        }
      });
    },
    //取消重置
    handleResetCancel() {
      this.currentAccount = {};
      this.resetModal = false;
    },
    // 输入框监听blur
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    // 校验是否符合规则
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback(this.$t("accountManagement.inconsistentPwd"));
      } else {
        callback();
      }
    },
    // 校验是否符合规则
    changeCompareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("newPassword")) {
        callback(this.$t("accountManagement.inconsistentPwd"));
      } else {
        callback();
      }
    },
    // 校验是否符合规则
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    // 点击删除
    deleteAccount(record) {
      this.currentAccount = record;
      this.deleteModal = true;
    },
    // 删除
    handleDeleteOk() {
      const _this = this;
      this.$axios
        .patch("deleteAccount", { id: this.currentAccount.accountId })
        .then((res) => {
          _this.currentAccount = {};
          if (res.data.retCode === 0) {
            _this.deleteModal = false;
            _this.getAllAccount();
          }
        });
    },
    // 取消删除
    handleDeleteCancel(e) {
      this.currentAccount = {};
      this.deleteModal = false;
    },
    // 点击修改
    change(record) {
      this.currentAccount = record;
      this.changeModal = true;
    },
    // 修改密码
    handleChangeOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          var oldPwd = values.oldPassword + this.currentAccount.salt;
          oldPwd = this.$md5(oldPwd);
          if (oldPwd !== this.currentAccount.accountPassword) {
            this.oldPwdWrong = true;
          } else {
            this.oldPwdWrong = false;
            const _this = this;
            this.$axios
              .patch("resetPassword", {
                accountId: this.currentAccount.accountId,
                accountPassword: values.newPassword,
              })
              .then((res) => {
                _this.currentAccount = {};
                if (res.data.retCode === 0) {
                  _this.changeModal = false;
                  _this.getAllAccount();
                  _this.changeSuccessModal = true;
                  setTimeout(() => {
                    _this.changeSuccessModal = false;
                  }, 3000);
                }
              });
          }
        }
      });
    },
    // 取消修改
    handleChangeCancel() {
      this.currentAccount = {};
      this.changeModal = false;
      this.oldPwdWrong = false;
    },
  },
};
</script>

<style lang="less" scoped>
.account-management {
  height: 100%;
  .top {
    height: 47px;
    line-height: 47px;
    .addAccount {
      color: #303030;
      display: inline-block;
      width: 88px;
      height: 32px;
      border-radius: 2px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
    .addAccount:hover {
      color: #007aff;
      border: 1px solid #007aff;
      height: 30px;
      line-height: 28px;
    }
    .iconfont {
      font-size: 16px;
    }
  }
  .list-content.paddingTop24 {
    padding: 24px 24px 72px 24px;
    .action {
      .change:hover,
      .reset:hover,
      .delete:hover {
        color: #007aff !important;
        cursor: pointer;
      }
    }
  }
  .list-content {
    padding: 72px 24px 72px 24px;
    .action {
      .change:hover,
      .reset:hover,
      .delete:hover {
        color: #007aff !important;
        cursor: pointer;
      }
    }
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
    line-height: 64px;
    ul {
      float: right;
    }
    .total {
      position: absolute;
      top: 24px;
      left: 24px;
      height: 14px;
      line-height: 14px;
    }
  }
}
.content {
  width: 100%;
  text-align: center;
  color: #151515;
  span.iconfont.iconziyuan13 {
    font-size: 24px;
    color: #ffb100;
    margin-top: -5px;
    display: inline-block;
    height: 24px;
    margin-bottom: 20px;
  }
  .p2 {
    margin-bottom: 24px;
    height: 14px;
    line-height: 14px;
  }
}
.addContent {
  display: flex;
  .iconziyuan13 {
    font-size: 24px;
    color: #ffb100;
    margin-right: 16px;
    display: inline-block;
    margin-top: -5px;
    height: 24px;
  }
}
.resetContent {
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
.oldPwdWrong {
  color: #e83021;
  background: url("../../assets/images/login/error.png") top left no-repeat;
  padding-left: 20px;
  margin-top: 5px;
  display: block;
  font-size: 12px !important;
  line-height: 16px !important;
  min-height: 16px !important;
}
.tip {
  font-size: 12px;
  line-height: 12px;
  color: #a5a5a5;
  display: inline-block;
  margin-top: 8px;
}
.en .account-management .top .addAccount {
  width: 120px;
}
</style>
