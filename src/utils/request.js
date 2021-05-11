import Vue from "vue";
// import VueRouter from "vue-router";
import axios from "axios";
import { message } from "ant-design-vue";
import { baseUrl } from "./env";
import router from '../router/index';
// Vue.use(VueRouter);

const vue = new Vue({router});
// 封装请求
axios.interceptors.request.use(
  config => {
    config.baseURL = baseUrl;
    if (!config.timeout) {
      config.timeout = 30000;
    }
    if (config.method == "post" && config.data) {
      config.headers = {
        "Content-Type": "multipart/form-data"
      };
    } else if (config.method == "patch" && config.data) {
      config.headers = {
        "Content-Type": "application/json"
      };
      config.method = "post";
    }
    return config;
  },
  error => {
    console.log("reject");
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    if (response.data.retMsg === "timeout") {
      message.destroy();
      message.error("请求超时！");
    }
    if(response.data.retCode === -100){
      vue.$router.push("/login");
    }
    return response;
  },
  error => {
    const errMsg = JSON.parse(JSON.stringify(error));
    if (errMsg.message === "Network Error") {
      window.history.go(0);
    }
  }
);

export default axios;
