<template>
  <!-- 后台系统侧边栏区域 -->
  <div class="leftNav">
    <div class="logo">
      <img class="logo-img" src="@/assets/images/leftNav/logo.png" alt="" />
      <div class="des">
        <p>ArcFaceGo</p>
        <p>{{ $t("leftNav.ArcFaceGo") }}</p>
      </div>
    </div>
    <!-- 路由展示 -->
    <div>
      <a-menu
        :openKeys="openKeys"
        :selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
        @openChange="openChange"
      >
        <a-sub-menu v-for="item in menu" :key="item.name" :index="item.title">
          <span slot="title"
            ><span class="iconfont iconziyuan4"></span
            ><span>{{ item.title }}</span></span
          >
          <a-menu-item
            v-for="subItem in item.submenu"
            :key="subItem.index"
            :index="subItem.index"
          >
            <router-link :to="subItem.path">
              {{ subItem.text }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
  </div>
</template>
<script>
export default {
  name: "leftNav",
  data() {
    return {
      admin: false,

      rootSubmenuKeys: [
        "/member",
        "/settings",
        "/recognize",
        "/equipment",
        "/account",
        "/system",
      ],
    };
  },
  computed: {
    // 选中的菜单项 key 数组
    selectedKeys() {
      let path = this.$route.path;
      if (path.indexOf("settings") !== -1) {
        if (path.indexOf("accessSettings") !== -1) {
          return ["/settings/accessSettings"];
        } else {
          return ["/settings/systemSettings"];
        }
      } else if (path.indexOf("equipment") !== -1) {
        if (path.indexOf("active") !== -1) {
          return ["/equipment/active"];
        } else {
          return ["/equipment/peripheralsSetting"];
        }
      } else if (path.indexOf("lookover") !== -1) {
        return ["/member/management"];
      } else if (path.indexOf("register") !== -1) {
        return ["/member/register"];
      } else if (path.indexOf("system") !== -1) {
        return ["/system/systemUpgrade"];
      } else {
        return [path.substr(path.indexOf("/"))];
      }
    },
    // 当前展开的 SubMenu 菜单项 key 数组
    openKeys: {
      get() {
        if (this.$route.path.indexOf("settings") !== -1) {
          return ["/settings"];
        } else if (this.$route.path.indexOf("lookover") !== -1) {
          return ["/member"];
        } else if (this.$route.path.indexOf("register") !== -1) {
          return ["/member"];
        } else if (this.$route.path.indexOf("equipment") !== -1) {
          return ["/equipment"];
        } else if (this.$route.path.indexOf("system") !== -1) {
          return ["/system"];
        } else {
          return [
            this.$route.path.substr(
              this.$route.path.indexOf("/"),
              this.$route.path.lastIndexOf("/")
            ),
          ];
        }
      },
      set: function (value) {
        this.changeVal(value);
      },
    },
    menu() {
      return this.$store.state.menuList;
    },
  },
  methods: {
    changeVal() {},
    // SubMenu 展开/关闭的回调
    openChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (latestOpenKey) {
        this.openKeys[0] = latestOpenKey.toString();
      }
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    isAdmin() {
      var username = this.$store.state.username;
      if (username.toLowerCase() === "Admin".toLowerCase()) {
        this.admin = true;
      }
    },
    // 获取menu菜单列表
    getMenuList() {
      const _this = this;
      this.$axios
        .patch("/getRoutesWithAccountId", {
          accountId: _this.$store.state.accountId,
        })
        .then((res) => {
          if (res.data.retCode === 0) {
            _this.$store.dispatch("setMenuList", res.data.info.menu);
          }
        });
    },
  },
  mounted() {
    this.getMenuList();
  },
};
</script>

<style lang="less" scoped>
@color: #002955;
.leftNav {
  background-color: @color;
  color: #fff;
  padding-top: 24px;
  height: 100%;
  .iconziyuan4 {
    width: 16px;
    height: 16px;
    display: inline-block;
    text-align: center;
    line-height: 16px;
    margin-right: 8px;
  }
  :global(.ant-menu-submenu-arrow) {
    display: none;
  }
  :global(.ant-menu-item-group-title) {
    display: none;
  }
  :global(.ant-menu-submenu-title) {
    color: #fff;
  }

  .ant-menu.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: #0077ff !important;
  }
  .ant-menu-dark .ant-menu-item,
  .ant-menu-dark .ant-menu-item-group-title,
  .ant-menu-dark .ant-menu-item > a {
    color: #fff;
  }
  .ant-menu-dark,
  .ant-menu-dark .ant-menu-sub {
    background-color: @color !important;
  }
  .logo {
    margin-bottom: 27px;
    .logo-img {
      border-radius: 50%;
      margin-left: 48px;
    }
    .des {
      margin-top: 3px;
      text-align: center;
      line-height: 24px;
      p {
        margin: 0;
      }
    }
  }
}
.en .logo-img {
  margin-left: 88px !important;
}
</style>
