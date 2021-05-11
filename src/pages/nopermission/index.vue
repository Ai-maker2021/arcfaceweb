<template>
<!-- 404 -->
  <div class="no-permission">
    <img
      :src="$store.state.language === 'zh_CN' ? npPermission : npPermissionEn"
      :alt="noPermission"
      class="npPermission"
    />
  </div>
</template>

<script>
import npPermission from "../../assets/images/noPermission.png";
import npPermissionEn from "../../assets/images/noPermission-en.png";
export default {
  name: "Home",
  data() {
    return {
      npPermission: npPermission,
      npPermissionEn: npPermissionEn,
    };
  },
  computed: {
    noPermission: function () {
      return this.$t("noPermission.noPermission");
    },
  },
};
</script>
<style lang="less">
.home__index {
  height: 100%;
}
.npPermission {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
}
</style>
