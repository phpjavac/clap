import Api from "./api";
import router from "@/router";
import { Message } from "view-design";
const api = new Api();
// 状态码错误信息
api.$http.interceptors.request.use(res => {
  const req = res;
  req.headers.Authorization = localStorage.token
    ? `Bearer ${localStorage.token}`
    : "";
  return req;
});
api.$http.interceptors.response.use(
  res => {
    // loading close...
    return res;
  },
  error => {
    if (error) {
      if (error.response) {
        // console.log(error.response);
        // 获取状态码
        const status = error.response.status;
        const errorText = error.response.data;
        const errorData = {
          status,
          errorText
        };
        console.log(status);

        switch (status) {
          case 401:
            Message.info({
              background: true,
              content: "身份认证已过期,请重新登录"
            });
            localStorage.clear();
            sessionStorage.clear();
            router.push("/");
            break;
          case 404:
            console.log("淡定, 只是404而已");
            break;
          case 400:
            Message.error({
              background: true,
              content: errorText
            });
            break;
          case 500:
            console.log("服务器内部错误");
            break;
          default:
            localStorage.clear();
            sessionStorage.clear();
            router.push("/");
            break;
        }

        return Promise.reject(errorData);
      } else {
        // localStorage.clear();
        // sessionStorage.clear();
        // router.push("/");
      }
    }
    return Promise.reject(error);
  }
);

const install = function apiFun(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.defineProperties(Vue.prototype, {
    $http: {
      get() {
        return api;
      }
    }
  });
};

export default {
  install
};
