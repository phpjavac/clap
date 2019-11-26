import axios from "axios";

class Api {
  $http = axios.create({
    baseURL: ""
  });
  /**
   * 添加用户接口
   */
  register(data) {
    return this.$http.post("./api/user/register", data);
  }
  login(data) {
    return this.$http.post("./api/user/login", data);
  }
  getUserList(role, pageNo, pageSize) {
    return this.$http.get("./api/user/list", {
      params: {
        role,
        pageNo,
        pageSize
      }
    });
  }
  /**
   * 取得用户相信信息
   */
  userInfo() {
    return this.$http.get("./api/user/userInfo");
  }
  /**
   * 更新用户信息
   */
  putUser(data) {
    return this.$http.put("./api/user/put", data);
  }
  /**
   * 删除用户
   */
  deluser(code) {
    return this.$http.delete("./api/user/deluser", {
      params: {
        code: code
      }
    });
  }
}
export default Api;
