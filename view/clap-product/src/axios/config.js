// 接口配置
// 服务器接口根地址
var url;
if (localStorage.getItem("serverUrl")) {
  url = localStorage.getItem("serverUrl");
} else {
  url = "http://findsoft.com.cn/tpl";
}
// var isProduction = process.env.NODE_ENV === "production";

// 服务器地址
export const SERVER_BASE_URL = url;
