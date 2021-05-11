let baseUrl = '';
// let routerMode = 'history';
let DEBUG = false;
let cancelHTTP = [];//取消请求头设置；
if (process.env.NODE_ENV == 'development') {//开发环境
   // baseUrl = "/arm";
   baseUrl = "/armDev";
   DEBUG = true;
}else{
   // 测试环境  /其他环境
   baseUrl = "/arm";
   DEBUG = false;
}

export{
   baseUrl,
   routerMode,
   DEBUG,
   ROLE,
   cancelHTTP
}
