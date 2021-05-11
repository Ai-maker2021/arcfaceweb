<template>
<!-- 设备激活 -->
  <div class="equipment-active">
    <!-- 编辑 -->
    <a-form
      v-if="flag"
      class="active-form"
      :form="form"
      :hideRequiredMark="true"
      labelAlign="left"
    >
      <a-form-item label="APP_ID" class="id toRight">
        <a-input
          style="border-color: white; background-color: white"
          disabled
          v-decorator="[
            'appId',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="SDK_KEY" class="key toRight">
        <a-input
          disabled
          style="border-color: white; background-color: white"
          v-decorator="[
            'sdkKey',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="ACTIVE_KEY" class="active toRight">
        <a-input
          disabled
          style="border-color: white; background-color: white"
          v-decorator="[
            'activeKey',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
          @input="activeKeyInput"
        >
        </a-input>
      </a-form-item>
      <a-form-item label=" " :colon="false" class="activeBtn">
        <a-button
          class="button"
          type="primary"
          :loading="loading"
          @click="editFun"
        >
          {{ $t("equipmentActive.edit") }}
        </a-button>
      </a-form-item>
    </a-form>
    <!-- 激活 -->
    <a-form
      v-else
      class="active-form"
      :form="form"
      @submit="handleSubmit"
      :hideRequiredMark="true"
      labelAlign="left"
    >
      <a-form-item label="APP_ID" class="id toRight">
        <a-input
          v-decorator="[
            'appId',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="SDK_KEY" class="key toRight">
        <a-input
          v-decorator="[
            'sdkKey',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="ACTIVE_KEY" class="active toRight">
        <a-input
          v-decorator="[
            'activeKey',
            {
              rules: [{ required: true, message: requireMessage }],
              validateTrigger: 'blur',
            },
          ]"
          :maxLength="50"
          @input="activeKeyInput"
        >
        </a-input>
      </a-form-item>
      <a-form-item label=" " :colon="false" class="activeBtn">
        <a-button
          class="button"
          type="primary"
          html-type="submit"
          :loading="loading"
        >
          {{ $t("equipmentActive.active") }}
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal
      :visible="successMessageVisible"
      :centered="true"
      :closable="false"
      :width="182"
      :footer="null"
      class="activeSuccess"
    >
      <div class="content">
        <span class="iconfont iconziyuan2"></span>
        <div>{{ $t("equipmentActive.activeOk") }}</div>
      </div>
    </a-modal>
    <a-modal
      :visible="failMessageVisible"
      :centered="true"
      :closable="false"
      :width="182"
      :footer="null"
      class="activeFail"
    >
      <div class="content">
        <span class="iconfont iconziyuan13"></span>
        <div>{{ $t("equipmentActive.activeFail") }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "equipmentActive",
  data() {
    return {
      successMessageVisible: false,
      failMessageVisible: false,
      loading: false,
      flag: false,
    };
  },
  computed: {
    requireMessage: function () {
      return this.$t("equipmentActive.required");
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "active" });
  },
  mounted() {
    this.getActivedMsg();
  },
  methods: {
    // 编辑
    editFun(e) {
      e.preventDefault();
      this.flag = false;
    },
    // 获取激活信息
    getActivedMsg() {
      const _this = this;
      this.$axios.get("getSDKInfo").then((res) => {
        if (res.data.retCode === 0) {
          _this.form.setFieldsValue({
            appId: res.data.info.appid,
            sdkKey: res.data.info.sdkkey,
            activeKey: res.data.info.activekey,
          });
          if (
            res.data.info.appid &&
            res.data.info.sdkkey &&
            res.data.info.activekey
          ) {
            // flag=true 这是编辑
            this.flag = true;
            // flag=false 这是激活
          } else {
            this.flag = false;
          }
        } else {
          if (res.data.info && res.data.info.code !== 1101) {
            this.$message.destroy();
            this.$message.error(res.data.retMsg);
          }
        }
      });
    },
    // 激活输入框设置值
    activeKeyInput(e) {
      this.form.setFieldsValue({
        activeKey: e.target.value
          .replace(/\s/g, " ")
          .replace(/([0-9a-zA-Z]{4})(?=\d)/g, "$1-"),
      });
    },
    // 提交事件
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          const _this = this;
          this.$axios
            .patch("setSDKInfo", {
              cmd: "setsdkinfo",
              appid: values.appId.replace(/\s+/g, ""),
              sdkkey: values.sdkKey.replace(/\s+/g, ""),
              activekey: values.activeKey.replace(/\s+/g, ""),
            })
            .then((res) => {
              this.loading = false;
              if (res.data.retCode === 0) {
                this.$message.destroy();
                this.$message.success(this.$t("equipmentActive.activeOk"));
              } else {
                this.$message.destroy();
                this.$message.error(res.data.info.message);
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.equipment-active {
  padding: 40px 0 0 80px;
  .button {
    width: 80px;
    height: 32px;
    border-radius: 2px;
  }
}
.content {
  display: flex;
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
</style>
