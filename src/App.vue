<template>
  <div id="app">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view v-wechat-title='$t($route.meta.title)'></router-view>
    </keep-alive>
    <router-view v-else v-wechat-title='$t($route.meta.title)'></router-view>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
  created(){
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    });
  },
  
 
methods: {
 },
  mounted() {
   },

  watch: {
    $route(to, from) {
      let activeUrl = false;
      for (let item of this.$store.state.menuList) {
        if (item.submenu.length > 0) {
          for (let subItem of item.submenu) {
            if (to.fullPath.includes(subItem.path)) {
              activeUrl = to.fullPath.includes(subItem.path);
              break;
            }
          }
        } else {
          if (to.fullPath.includes(item.name)) {
            activeUrl = to.fullPath.includes(item.name);
            break;
          }
        }
      }
      if (!activeUrl) {
        activeUrl = "/login,/firstLogin".includes(to.fullPath);
      }
      if (!activeUrl) {
         this.$router.history.push("/nopermission/index");
      }
    },
  },
};
</script>

<style>
@import "assets/css/base.css";
#app {
  color: #151515;
  height: 100vh;
  font-family: "Source Han Sans CN";
}
</style>
