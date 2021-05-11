<template>
<!--  后台头部模块  -->
  <div class="header-container">
    <div
      v-if="
        settingTitles.indexOf(pageTitle) === -1 &&
          systemSettings.indexOf(pageTitle) === -1 &&
          activeTitles.indexOf(pageTitle) === -1 &&
          systemTitles.indexOf(pageTitle) === -1 &&
          openTitles.indexOf(pageTitle) === -1
      "
    >
    <!-- 人员管理 -->
      <div class="title">
        {{ pageTitle }}
      </div>

      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
    <!-- 门禁机设置 -->
    <div class="titles" v-if="settingTitles.indexOf(pageTitle) !== -1">
      <router-link
        v-for="item in settingTitles"
        :key="item"
        :class="{ pageActive: pageTitle === item }"
        :to="getLink(item)"
        >{{ item }}</router-link
      >
      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
    <!-- 系统设置 -->
    <div class="titles" v-if="systemSettings.indexOf(pageTitle) !== -1">
      <router-link
        v-for="item in systemSettings"
        :key="item"
        :class="{ pageActive: pageTitle === item }"
        :to="getLink(item)"
        >{{ item }}</router-link
      >

      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
    <!-- 设备激活 -->
    <div class="titles" v-if="activeTitles.indexOf(pageTitle) !== -1">
      <router-link
        v-for="item in activeTitles"
        :key="item"
        :class="{ pageActive: pageTitle === item }"
        :to="getLink(item)"
        >{{ item }}
      </router-link>
      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
    <!-- 系统维护 -->
    <div class="titles" v-if="systemTitles.indexOf(pageTitle) !== -1">
      <router-link
        v-for="item in systemTitles"
        :key="item"
        :class="{ pageActive: pageTitle === item }"
        :to="getLink(item)"
        >{{ item }}
      </router-link>
      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
    <!-- 外设设置：开门设置 测温模组设置 -->
    <div class="titles" v-if="openTitles.indexOf(pageTitle) !== -1">
      <router-link
        v-for="item in openTitles"
        :key="item"
        :class="{ pageActive: pageTitle === item }"
        :to="getLink(item)"
        >{{ item }}
      </router-link>
      <div class="account">
        <a-dropdown>
          <div class="ant-dropdown-link">
            <a class="account-name" @click="e => e.preventDefault()">
              {{ $store.state.username }}
            </a>
            <img
              class="super"
              src="@/assets/images/headerNav/super.png"
              alt=""
            />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="logout">{{ $t("headerNav.logout") }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="versionNum">{{ $t("headerNav.version") }}{{ version }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerNav",
  data() {
    return {
      version: ""
    };
  },
  computed: {
    accessSettings: function() {
      return this.$t("headerNav.accessSettings");
    },
    recognizeSettings: function() {
      return this.$t("headerNav.recognizeSettings");
    },
    personalizedSettings: function() {
      return this.$t("headerNav.personalizedSettings");
    },
    warmthSettings: function() {
      return this.$t("headerNav.warmthSettings");
    },
    basicSettings: function() {
      return this.$t("headerNav.basicSettings");
    },
    networkSettings: function() {
      return this.$t("headerNav.networkSettings");
    },
    settingTitles: function() {
      return [
        this.accessSettings,
        this.recognizeSettings,
        this.personalizedSettings,
        this.warmthSettings
      ];
    },
    systemSettings: function() {
      return [this.basicSettings, this.networkSettings, this.wifiSettings];
    },
    wifiSettings: function() {
      return this.$t("headerNav.wifiSettings");
    },
    //设备激活
    activeTitles: function() {
      return [this.active, this.offlineactive];
    },
    //开门设置
    openTitles: function() {
      return [this.openDoor, this.temperaturemodule];
    },
    openDoor: function() {
      return this.$t("headerNav.openDoor");
    },
    temperaturemodule: function() {
      return this.$t("headerNav.temperaturemodule");
    },
    offlineactive: function() {
      return this.$t("headerNav.offlineactive");
    },
    active: function() {
      return this.$t("headerNav.active");
    },

    //系统维护
    systemTitles: function() {
      return [this.systemUpgrade];
    },
    systemUpgrade: function() {
      return this.$t("headerNav.systemUpgrade");
    },

    pageTitle: {
      get() {
        return this.$t(this.$route.meta.title);
      }
    }
  },
  mounted() {
    this.getVersion();
  },
  methods: {
    // 退出账号
    logout() {
      const _this = this;
      this.$axios.get("logout").then(res => {
        if (res.data.retCode === 0) {
          _this.$router.push("/login");
          _this.$store.commit("setUsername", "");
          _this.$store.dispatch("setMenuList", []);
          _this.$store.dispatch("setAccountId", 0);
        }
      });
    },
    // 获取版本信息
    getVersion() {
      this.$axios.get("getVersion").then(res => {
        if (res.data.retCode === 0) {
          this.version = res.data.info.MainVersion;
          // this.$store.dispatch("setVersion", res.data.info.MainVersion || '');
          this.$store.dispatch(
            "setArcFaceGoversion",
            res.data.info.ArcFaceGoVersion || ""
          );
          this.$store.dispatch(
            "setArcFaceServerversion",
            res.data.info.ArcFaceServerVersion || ""
          );
        }
      });
    },
    // 获取title名对应的路由
    getLink(title) {
      switch (title) {
        case this.accessSettings:
          return "/settings/accessSettings";
          break;
        case this.recognizeSettings:
          return "/settings/accessSettings/recognizeSettings";
          break;
        case this.personalizedSettings:
          return "/settings/accessSettings/personalizedSettings";
          break;
        case this.warmthSettings:
          return "/settings/accessSettings/warmthSettings";
          break;
        case this.basicSettings:
          return "/settings/systemSettings";
          break;
        case this.networkSettings:
          return "/settings/systemSettings/networkSettings";
          break;
        case this.wifiSettings:
          return "/settings/systemSettings/wifiSettings";
          break;
        case this.active:
          return "/equipment/active";
          break;
        case this.offlineactive:
          return "/equipment/active/offlineactive";
          break;
        case this.openDoor:
          return "/equipment/peripheralsSetting";
          break;
        case this.temperaturemodule:
          return "/equipment/peripheralsSetting/temperaturemodule";
          break;
        case this.systemUpgrade:
          return "/system/systemUpgrade";
          break;
        default:
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header-container {
  line-height: 48px;
  padding: 0 24px;
  .title {
    display: inline-block;
    font-size: 16px;
    color: #007aff;
    font-weight: 700;
  }
  .versionNum {
    float: right;
    margin-right: 24px;
  }
  .account {
    float: right;
    height: 48px;
    font-size: 14px;
    .account-name {
      margin-right: 8px;
      font-size: 14px;
      color: #151515;
    }
    .super {
      display: inline-block;
      width: 24px;
      height: 24px;
    }
  }
  .titles a {
    color: #707070;
    display: inline-block;
    font-size: 16px;
    margin-right: 32px;
    height: 47px;
  }
  .titles a.pageActive {
    color: #007aff;
    font-weight: 700;
    border-bottom: 2px solid #007aff;
  }
}
</style>
