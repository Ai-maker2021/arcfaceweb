export default {
  // 设置页面标题
  setTitle: function(title) {
    title = title ? title : "ARM";
    window.document.title = title;
  },

  // 读取本地excel文件
  readWorkbookFromLocalFile: function(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XSLX.read(data, { type: "array" });
      if (callback) callback(workbook);
    };
    reader.readAsArrayBuffer(file);
  },

  // 导出excel文件
  exportExcel: function(data) {
    if (!data) {
      return;
    }
    var blob = new Blob([data], { type: "application/octet-stream" });
    if ("msSaveOrOpenBlob" in navigator) {
      window.navigator.msSaveOrOpenBlob(blob, document.title + ".csv");
      return;
    }
    var url = window.URL.createObjectURL(blob);
    var aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", document.title + ".csv");
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  },

  // 判断日期格式 yyyy-mm-dd hh:mm:ss
  checkDateTime: function(str) {
    const reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const r = str.match(reg);
    if (r == null) return false;
    const d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (
      d.getFullYear() == r[1] &&
      d.getMonth() + 1 == r[3] &&
      d.getDate() == r[4] &&
      d.getHours() == r[5] &&
      d.getMinutes() == r[6] &&
      d.getSeconds() == r[7]
    );
  },

  // 获取年-月-日 时:分:秒
  getDate: function(time, flag) {
    if (time < 0 || time === null) {
      return "";
    }
    var today;
    var date = new Date(time);
    var Y = date.getFullYear();
    var M = ("0" + (date.getMonth() + 1)).slice(-2);
    var D = ("0" + date.getDate()).slice(-2);
    if (flag) {
      var h = ("0" + date.getHours()).slice(-2);
      var m = ("0" + date.getMinutes()).slice(-2);
      var s = ("0" + date.getSeconds()).slice(-2);
      today = `${Y}-${M}-${D} ${h}:${m}:${s}`;
    } else {
      today = `${Y}-${M}-${D}`;
    }
    return today;
  },

  // 获取当前日期
  getNow: function(flag) {
    var date = new Date(Date.now());
    var today;
    var Y = date.getFullYear();
    var M = ("0" + (date.getMonth() + 1)).slice(-2);
    var D = ("0" + date.getDate()).slice(-2);
    if (flag) {
      var h = ("0" + date.getHours()).slice(-2);
      var m = ("0" + date.getMinutes()).slice(-2);
      var s = ("0" + date.getSeconds()).slice(-2);
      today = `${Y}年-${M}月-${D}日 ${h}:${m}:${s}`;
    } else {
      today = `${Y}年-${M}月-${D}日`;
    }
    return today;
  }
};
