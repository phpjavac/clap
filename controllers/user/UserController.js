const {query} = require('../../utils/sql');
/**
   *
   * @param {user用户接口} ctx
   */
class UserController {
  /**
   *
   * @param {登录接口} ctx
   */
  async login(ctx) {
    console.log(ctx.request.body);
    const {code, password} = ctx.request.body;
    console.log(code, password);
    if (!code||!password) {
      return ctx.throw(400, {
        message: '用户或密码不能为空!',
      });
    };
    const res = await query(`select * from user where code = '${code}'`);
    if (res.length === 0) {
      return ctx.throw(400, {
        message: '用户不存在!',
      });
    }
    ctx.body = {
      status: true,
      token: '123',
      list: res,
    };
    // await ……
  }
}
module.exports = new UserController();
