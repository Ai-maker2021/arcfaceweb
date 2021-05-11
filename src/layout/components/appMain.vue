<template>
  <div class="app-main-content">
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: "appMain",
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    }
  },

  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        if (document.getElementsByClassName("app-main")[0]) {
          document.getElementsByClassName("app-main")[0].scrollTop = 0;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
