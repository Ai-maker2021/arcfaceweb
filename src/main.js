import Vue from "vue";
import Vuex from "vuex";
import less from "less";

import App from "./App";
import router from "./router";
import request from "./utils/request";
import utils from "./utils/utils";
import createStore from "./store/index";
import antd, { message } from "ant-design-vue";
import { Form } from "ant-design-vue";
import md5 from "js-md5";

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

import "@/assets/iconfont/iconfont.js";
import "@/assets/iconfont/iconfont.css";
import "ant-design-vue/dist/antd.css";
import "babel-polyfill"

Vue.use(Vuex);
Vue.use(less);
Vue.use(antd);

const store = createStore();

Vue.prototype.$axios = request;
Vue.prototype.$utils = utils;
Vue.prototype.$form = Form;
Vue.prototype.$md5 = md5;
Vue.prototype.$log=(str)=>{
  console.log(str)
}
Date.prototype.Format = function (fmt){
  var o = {
          "M+": this.getMonth() + 1,  //月份
          "d+": this.getDate() ,  //日
          "h+": this.getHours() ,  //24小时制
          "m+": this.getMinutes(),  //分
          "s+": this.getSeconds(),  //秒
          "q+": Math.floor((this.getMonth()+3)/3),  //季度
          "S": this.getMilliseconds()  //毫秒
  };
  if(/(y+)/.test(fmt)) 
      fmt = fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
  for(var k in o)
      if(new RegExp("("+k+")").test(fmt))
          fmt = fmt.replace(RegExp.$1,(RegExp.$1.length ==1) ? (o[k]):(("00"+o[k]).substr((""+o[k]).length)));
  return fmt;

};






Vue.config.productionTip = false;

// var pathtxt='http://'+localStorage.getItem('pathtxt')
// console.log(pathtxt)//http://172........


let lang=localStorage.getItem('lang');
const i18n = new VueI18n({
  // locale: 'zh',
  // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
  // locale: localStorage.getItem('lang') || 'zh',
  locale: lang || 'zh',
  messages: {
    'zh': require('@/assets/languages/zh.json'),
    'en': require('@/assets/languages/en.json')
  },
  silentFallbackWarn: true
})
// 利用路由导航钩子，路由跳转时候触发
// 设置页面标题内容，i18n国际化处理
router.beforeEach((to, from, next) => {
  utils.setTitle(i18n.t(to.meta.title));
  next();
});
/* eslint-disable no-new */
export default new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

