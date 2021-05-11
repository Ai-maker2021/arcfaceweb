<template>
<!-- layout布局动态路由-->
  <div class="layout" :class="{ en: $store.state.language === 'en_US' }">
    <div class="left-nav">
      <left-nav />
    </div>
    <div class="content-main">
      <div class="header-nav">
        <header-nav />
      </div>
      <div class="app-main">
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
// import firstPath from "./components/firstPath"
import HeaderNav from "./components/headerNav";
import LeftNav from "./components/leftNav";
import AppMain from "./components/appMain";
export default {
  name: "layout",
  data() {
    return {
      language: "",
    };
  },
  components: {
    HeaderNav,
    LeftNav,
    AppMain,
  },
  mounted() {
    this.getLanguage();
  },
  methods: {
    // 获取当前语言
    getLanguage() {
      this.$axios.get("getLanguage").then((res) => {
        if (res.data.retCode === 0) {
          let info = res.data.info;
          this.$i18n.locale = info.lang === "zh_CN" ? 'zh' : 'en';
          this.$store.commit("setLanguage", info.lang);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  font-size: 14px;
  .left-nav {
    width: 160px;
    float: left;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .content-main {
    width: calc(100% - 160px);
    height: 100%;
    overflow: hidden;
    .header-nav {
      background-color: rgba(0, 122, 255, 0.08);
      float: right;
      height: 48px;
      width: 100%;
    }
    .app-main {
      float: left;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      overflow: auto;
    }
  }
}
.en.layout {
  .left-nav {
    width: 240px;
  }
  .content-main {
    width: calc(100% - 240px);
  }
}
</style>
