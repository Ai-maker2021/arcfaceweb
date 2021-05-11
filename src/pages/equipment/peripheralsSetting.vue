<template>
<!-- 外设设置 -->
  <div class="box">
    <a-form :form="form" @submit="handleSubmit" :hideRequiredMark="true">
      <a-form-item>
        <a-checkbox
          style="zoom: 130%"
          v-decorator="[
            'relayOpen',
            {
              valuePropName: 'checked',
            },
          ]"
        >
          {{ $t("OpenDoorSetting.relay") }}
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          style="zoom: 130%"
          :disabled="this.strange == true"
          v-decorator="[
            'wigginsOpen',
            {
              valuePropName: 'checked',
            },
          ]"
        >
          {{ $t("OpenDoorSetting.wiggins") }}
        </a-checkbox>
      </a-form-item>
      <a-form-item style="margin-left: 38px">
        <span>
          {{ $t("OpenDoorSetting.Wigginsdigits") }}
        </span>
        <a-select
          :disabled="this.wigginIsChecked || this.strange == true"
          v-model="Wigginsdigits"
          style="width: 120px; margin-left: 25px"
        >
          <a-select-option value="26"> 26bit </a-select-option>
          <a-select-option value="34"> 34bit </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
          style="margin-left: 90px; border-radius: 2px"
        >
          {{ $t("OpenDoorSetting.save") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "openDoor",
  data() {
    return {
      Wigginsdigits: "",
      strange: "",
      wigginIsChecked: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "openDoor",
      onValuesChange: (props, values) => {
        if (!values.wigginsOpen) {
          this.wigginIsChecked = true;
        } else {
          this.wigginIsChecked = false;
        }
      },
    });
  },
  mounted() {
    this.getdefaultMsg();
    this.strange = localStorage.getItem("common");
  },
  methods: {
    // 保存设置
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          let relay = values.relayOpen === true ? 1 : 0;
          let wiggins = values.wigginsOpen === true ? 1 : 0;
          let bits = this.Wigginsdigits.includes("26") ? "26" : "34";
          formData.append("relayEnable", relay);
          formData.append("wiegangEnable", wiggins);
          formData.append("bits", bits);
          this.$axios.post("setOpenDoorSetting", formData).then((res) => {
            if (res.data.retCode === 0) {
              this.$message.destroy();
              this.$message.success(this.$t("OpenDoorSetting.settingOk"));
              this.getdefaultMsg();
            } else {
              this.$message.destroy();
              this.$message.error(res.data.retMsg);
            }
          });
        }
      });
    },
    // 获取默认数据
    getdefaultMsg() {
      const _this = this;
      this.$axios.get("getOpenDoorSetting").then((res) => {
        if (res.data.retCode === 0) {
          let bits =
            Number(res.data.info.bits) === 26
              ? 26
              : Number(res.data.info.bits) === 34
              ? 34
              : 26;
          _this.form.setFieldsValue({
            relayOpen: res.data.info.relayEnable === 1,
            wigginsOpen: res.data.info.wiegangEnable === 1,
          });
          this.Wigginsdigits = bits + "bit";
        }
      });
    },
  },
};
</script>
<style lang="less" scoped="scoped">
.box {
  margin-left: 80px;
  margin-top: 40px;
}
</style>
