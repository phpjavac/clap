import axios from "axios";

class Api {
  $http = axios.create({
    baseURL: ""
  });
  login(data) {
    return this.$http.post("./api/user/login", data);
  }
  userList() {
    return this.$http.get("./api/user/list");
  }
  /**
   * 取得用户相信信息
   */
  userInfo(data) {
    console.log(data);
    return this.$http.get("./api/user/userInfo");
  }
}
export default Api;
