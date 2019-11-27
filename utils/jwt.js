const jwtArr = ['/api/user/login', '/api/user/uploadUser'];
module.exports = function(app) {
  const koaJwt = require('koa-jwt');
  const {secretKey} = require('./constant');
  const jwtAuth = koaJwt({secret: secretKey}).unless({path: jwtArr});
  // 所有请求过来都会进行身份验证
  app.use(jwtAuth);
};
