import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout/layout.vue";
import uri from "../utils/baseUri";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "toLogin",
    redirect: "/login",
    component: () => import("@/pages/login/login"),
    meta: { title: "router.login" }
  },
  {
    path: "/firstLogin",
    name: "firstLogin",
    component: () => import("@/pages/login/firstLogin"),
    meta: { title: "router.firstLogin" }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/login"),
    meta: { title: "router.login" }
  },
  //人员管理
  {
    path: "/member",
    name: "member",
    component: Layout,
    redirect: "/member/management",
    children: [
      {
        path: "management",
        name: "management",
        component: () => import("@/pages/member/management"),
        meta: { title: 'router.management', keepAlive: true }
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/pages/member/register"),
        meta: { title: "router.register" }
      },
      {
        path: "register/:id",
        name: "registerById",
        component: () => import("@/pages/member/register"),
        meta: { title: "router.register" }
      },
      {
        path: "management/lookover/:id",
        name: "lookover",
        component: () => import("@/pages/member/lookover"),
        meta: { title: "router.lookover" }
      }
    ]
  },
  //门禁机设置
  {
    path: "/settings",
    name: "settings",
    component: Layout,
    redirect: "/settings/accessSettings",
    children: [
      {
        path: "accessSettings",
        name: "accessSettings",
        component: () => import("@/pages/settings/accessSettings"),
        meta: { title: "router.accessSettings" }
      },
      {
        path: "accessSettings/recognizeSettings",
        name: "recognizeSettings",
        component: () => import("@/pages/settings/recognizeSettings"),
        meta: { title: "router.recognizeSettings" }
      },
      {
        path: "accessSettings/personalizedSettings",
        name: "personalizedSettings",
        component: () => import("@/pages/settings/personalizedSettings"),
        meta: { title: "router.personalizedSettings" }
      },
      {
        path: "accessSettings/warmthSettings",
        name: "warmthSettings",
        component: () => import("@/pages/settings/warmthSettings"),
        meta: { title: "router.warmthSettings" }
      },
      {
        path: "systemSettings",
        name: "systemSettings",
        component: () => import("@/pages/settings/basicSettings"),
        meta: { title: "router.systemSettings" }
      },
      {
        path: "systemSettings/networkSettings",
        name: "networkSettings",
        component: () => import("@/pages/settings/networkSettings"),
        meta: { title: "router.networkSettings" }
      },
      {
        path: "systemSettings/wifiSettings",
        name: "wifiSettings",
        component: () => import("@/pages/settings/wifiSettings"),
        meta: { title: "router.wifiSettings" }
      },
    ]
  },
  //识别记录
  {
    path: "/recognize",
    name: "recognize",
    component: Layout,
    redirect: "/recognize/record",
    children: [
      {
        path: "record",
        name: "record",
        component: () => import("@/pages/recognize/recognize"),
        meta: { title: "router.record" }
      }
    ]
  },
  //运维设置
  {
    path: "/equipment",
    name: "equipment",
    component: Layout,
    redirect: "/equipment/active",
    children: [
      {
        path: "active",
        name: "active",
        component: () => import("@/pages/equipment/equipment-active"),
        meta: { title: "router.active" }
      },
      {
        path:"active/offlineactive",
        name:"offlineactive",
        component: () => import("@/pages/equipment/offlineactive"),
        meta: { title: "router.offlineactive" }
      },
      {
        // /equipment/peripheralsSetting
        path: "peripheralsSetting",
        name: "peripheralsSetting",
        component: () => import("@/pages/equipment/peripheralsSetting"),
        meta: { title: "router.openDoor" }
      },
      {
        path: "peripheralsSetting/temperaturemodule",
        name: "temperaturemodule",
        component: () => import("@/pages/equipment/temperaturemodule"),
        meta: { title: "router.temperaturemodule" }
      },
    ]
  },
  //系统升级 /system/systemUpgrade
  {
    path: "/system",
    name: "system",
    component: Layout,
    redirect: "/system/systemUpgrade",
    children: [
      {
        path: "systemUpgrade",
        name: "systemUpgrade",
        component: () => import("@/pages/system/systemUpgrade"),
        meta: { title: "router.systemUpgrade" }
      },]
   },
  {
    path: "/account",
    name: "account",
    component: Layout,
    redirect: "/account/accountManagement",
    children: [
      {
        path: "accountManagement",
        name: "accountManagement",
        component: () => import("@/pages/account/account-management"),
        meta: { title: "router.accountManagement" }
      },
      {
        path: "roleManagement",
        name: "roleManagement",
        component: () => import("@/pages/account/role-management"),
        meta: { title: "router.roleManagement" }
      }
    ]
  },
  {
    path: "/nopermission",
    name: "noPerLayout",
    component: Layout,
    redirect: "/nopermission/index",
    children: [
      {
        path: "index",
        name: "noPerindex",
        component: () => import("@/pages/nopermission/index"),
        meta: { title: "router.noPerindex" }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: uri,
  linkActiveClass: "active",
  linkExactActiveClass: "exactActive",
  router: true,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
