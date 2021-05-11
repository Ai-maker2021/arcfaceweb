<template>
<!-- 角色管理 -->
  <div>
    <div class="role-management">
      <top-bar class="top">
        <div slot="top-content" class="addAccount" @click="addRole">
          <span class="iconfont iconzhuce"></span>
          {{ $t("roleManagement.addRole") }}
        </div>
      </top-bar>
      <div class="list-content">
        <a-table
          row-key="roleId"
          :columns="columns"
          :data-source="roleList"
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
          <template slot="action" slot-scope="text, record" class="action">
            <a-modal
              :destroyOnClose="true"
              :title="Title"
              :visible="updateVisible"
              :confirm-loading="confirmLoading"
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
                  @click="handleUpdateOk(record.roleId)"
                  class="modal-submit"
                >
                  {{ $t("roleManagement.confirm") }}
                </a-button>
                <a-button
                  key="back"
                  @click="handleUpdateCancel"
                  class="modal-cancel"
                >
                  {{ $t("roleManagement.cancel") }}
                </a-button>
              </template>
              <a-form
                :form="form"
                @submit="handleUpdateCancel"
                class="role-add"
              >
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'roleName',
                      {
                        rules: [{ required: true, message: requireMessage }],
                        validateTrigger: 'blur',
                        initialValue: initialRoleName,
                      },
                    ]"
                    :placeholder="rolenamePlaceholder"
                    :maxLength="30"
                  />
                </a-form-item>
                <a-form-item>
                  <a-select
                    mode="multiple"
                    :suffixIcon="downIcon"
                    :showArrow="true"
                    :maxTagCount="1"
                    v-decorator="[
                      'limit',
                      {
                        rules: [{ required: true, message: requireMessage }],
                        validateTrigger: 'blur',
                        initialValue: initialLimit,
                      },
                    ]"
                    :placeholder="chooseLimit"
                  >
                    <a-select-option
                      v-for="(item, index) in authorityList"
                      :key="index"
                      :value="item.id.toString()"
                    >
                      {{ item.authorityName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-modal>
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
                  @click="handleDeleteOk(record.roleId)"
                  class="modal-submit"
                >
                  {{ $t("roleManagement.confirm") }}
                </a-button>
                <a-button
                  key="back"
                  @click="handleDeleteCancel"
                  class="modal-cancel"
                >
                  {{ $t("roleManagement.cancel") }}
                </a-button>
              </template>
              <div class="content">
                <span class="iconfont iconziyuan13"></span>
                <div class="p2">
                  {{ $t("roleManagement.confirmDeleteRole") }}
                </div>
              </div>
            </a-modal>
            <div v-if="record.roleName !== 'Admin'">
              <span @click="updateRole(record.roleId, record)" class="edit">{{
                $t("roleManagement.edit")
              }}</span>
              <a-divider type="vertical" />
              <span @click="deleteRole(record)" class="delete">{{
                $t("roleManagement.delete")
              }}</span>
            </div>
          </template>
          <template slot="authority" slot-scope="text, record">
            <span v-for="(item, index) in record.authorityInfo" :key="index"
              >{{ item.authorityName
              }}<span v-if="index != record.authorityInfo.length - 1"
                >、</span
              ></span
            >
          </template>
        </a-table>
      </div>
      <!-- 确认弹窗 -->
      <a-modal
        :destroyOnClose="true"
        :title="Title"
        :visible="visible"
        :confirm-loading="confirmLoading"
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
            @click="handleOk"
            class="modal-submit"
          >
            {{ $t("roleManagement.confirm") }}
          </a-button>
          <a-button key="back" @click="handleCancel" class="modal-cancel">
            {{ $t("roleManagement.cancel") }}
          </a-button>
        </template>
        <a-form :form="form" @submit="handleOk" class="role-add">
          <a-form-item>
            <a-input
              v-decorator="[
                'roleName',
                {
                  rules: [{ required: true, message: requireMessage }],
                  validateTrigger: 'blur',
                },
              ]"
              :placeholder="rolenamePlaceholder"
              :maxLength="30"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              mode="multiple"
              :suffixIcon="downIcon"
              :showArrow="true"
              :maxTagCount="1"
              v-decorator="[
                'limit',
                {
                  rules: [{ required: true, message: requireMessage }],
                  validateTrigger: 'blur',
                },
              ]"
              :placeholder="chooseLimit"
            >
              <a-select-option
                v-for="(item, index) in authorityList"
                :key="index"
                :value="item.id.toString()"
              >
                {{ item.authorityName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 删除失败modal框 -->
      <a-modal
        :visible="deleteFailModal"
        :centered="true"
        :closable="false"
        :width="288"
        :footer="null"
        class="deleteFail"
      >
        <div class="deleteContent">
          <span class="iconfont iconziyuan13"></span>
          <div>{{ $t("roleManagement.roleUsing") }}</div>
        </div>
      </a-modal>
      <a-modal
        :visible="updateFailModal"
        :centered="true"
        :closable="false"
        :width="288"
        :footer="null"
        class="deleteFail"
      >
        <div class="updateContent">
          <span class="iconfont iconziyuan13"></span>
          <div>{{ $t("roleManagement.roleExit") }}</div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/topBar/topBar";
export default {
  name: "roleManagement",
  data() {
    return {
      page: 1,
      total: 0,
      roleList: [],
      authorityList: [],

      pageSize: 24,
      visible: false,
      deleteModal: false,
      updateVisible: false,
      deleteFailModal: false,
      updateFailModal: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: "add-role" }),
      downIcon: <span class="iconfont iconziyuan4"></span>,
      deleteTitle: " ",
      initialLimit: [],
      initialRoleName: "",
      currentRole: {},
    };
  },
  computed: {
    columns: function () {
      return [
        {
          title: this.$t("roleManagement.index"),
          customRender: (text, record, index) =>
            `${index + 1 + (this.page - 1) * 24}`,
        },
        {
          title: this.$t("roleManagement.createTime"),
          dataIndex: "roleCreateTime",
          key: "roleCreateTime",
          ellipsis: true,
        },
        {
          title: this.$t("roleManagement.roleName"),
          dataIndex: "roleName",
          key: "roleName",
          ellipsis: true,
        },
        {
          title: this.$t("roleManagement.authorityName"),
          dataIndex: "authorityName",
          key: "authorityName",
          ellipsis: true,
          scopedSlots: { customRender: "authority" },
        },

        {
          title: this.$t("roleManagement.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ];
    },
    Title: function () {
      return this.$t("roleManagement.roleMsgTitle");
    },
    requireMessage: function () {
      return this.$t("roleManagement.required");
    },
    rolenamePlaceholder: function () {
      return this.$t("roleManagement.rolename");
    },
    chooseLimit: function () {
      return this.$t("roleManagement.chooseLimit");
    },
  },
  components: {
    TopBar,
  },
  mounted() {
    this.getAllRole();
    this.getAllAuthorities();
  },
  methods: {
    // 点击添加
    addRole() {
      this.visible = true;
    },
    // 添加角色
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const _this = this;
          this.$axios
            .patch("createRole", {
              roleName: values.roleName,
              authorityIds: values.limit,
            })
            .then((res) => {
              if (res.data.retCode === 0) {
                _this.visible = false;
                _this.getAllRole();
              } else if (res.data.retMsg === "RoleName already exists.") {
                _this.visible = false;
                _this.updateFailModal = true;
                setInterval(() => {
                  _this.updateFailModal = false;
                }, 3000);
              }
            });
        }
      });
    },
    // 取消添加
    handleCancel(e) {
      this.currentRole = {};
      this.visible = false;
    },
    //点击编辑
    updateRole(id, record) {
      this.currentRole = record;
      let authorityList = [];
      let roleName = "";
      for (let role of this.roleList) {
        if (role.roleId === id) {
          if (
            role.authorityInfo[0].authorityName.toLowerCase() ===
            "Admin".toLowerCase()
          ) {
            const authorityInfo = this.authorityList;
            for (let item of authorityInfo) {
              authorityList.push(item.id.toString());
            }
          } else {
            for (let item of role.authorityInfo) {
              authorityList.push(item.authorityId);
            }
          }
          roleName = role.roleName;
        }
      }
      this.initialLimit = authorityList;
      this.initialRoleName = roleName;
      this.updateVisible = true;
    },
    // 编辑角色
    handleUpdateOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const _this = this;
          this.$axios
            .patch("updateRole", {
              roleName: values.roleName,
              roleId: parseInt(this.currentRole.roleId),
              authorityIds: values.limit,
            })
            .then((res) => {
              _this.updateVisible = false;
              _this.initialLimit = [];
              _this.initialRoleName = "";
              _this.currentRole = {};
              if (res.data.retCode === 0) {
                _this.getAllRole();
              } else {
                _this.updateFailModal = true;
                setTimeout(() => {
                  _this.updateFailModal = false;
                }, 3000);
              }
            });
        }
      });
    },
    // 取消编辑
    handleUpdateCancel(e) {
      this.initialLimit = [];
      this.initialRoleName = "";
      this.updateVisible = false;
    },
    // 点击删除
    deleteRole(record) {
      this.currentRole = record;
      this.deleteModal = true;
    },
    // 删除角色
    handleDeleteOk() {
      const _this = this;
      this.$axios
        .patch("deleteRole", {
          id: parseInt(this.currentRole.roleId),
        })
        .then((res) => {
          _this.deleteModal = false;
          _this.currentRole = {};
          if (res.data.retCode === 0) {
            _this.getAllRole();
          } else if (res.data.retCode === -1) {
            _this.deleteFailModal = true;
            setTimeout(() => {
              _this.deleteFailModal = false;
            }, 3000);
          }
        });
    },
    // 取消删除
    handleDeleteCancel(e) {
      this.currentRole = {};
      this.deleteModal = false;
    },
    // 获取所有角色
    getAllRole() {
      const _this = this;
      this.$axios.get("getAllRoles").then((res) => {
        if (res.data.retCode === 0) {
          let data = res.data.info;
          for (let role of data) {
            if (!_this.$utils.checkDateTime(role.roleCreateTime)) {
              role.roleCreateTime = _this.$utils.getDate(
                role.roleCreateTime,
                true
              );
            }
          }
          _this.roleList = data;
          _this.total = data.length;
        }
      });
    },
    // 换页
    handlePageChange() {},
    // 获取下拉权限列表
    getAllAuthorities() {
      const _this = this;
      this.$axios.get("getAllAuthorities").then((res) => {
        if (res.data.retCode === 0) {
          const data = res.data.info;
          for (var i = 0; i < data.length; i++) {
            if (data[i].authorityName.toLowerCase() === "Admin".toLowerCase()) {
              data.splice(i, 1);
            }
          }
          _this.authorityList = data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.role-management {
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
      line-height: 30px;
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
  .list-content {
    padding: 72px 24px 72px 24px;
    .delete:hover,
    .edit:hover {
      color: #007aff;
      cursor: pointer;
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
.deleteContent {
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
}
.updateContent {
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
.noPermission {
  text-align: center;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  color: #007aff;
  font-weight: 700;
  font-size: 50px;
}
</style>
