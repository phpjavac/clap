const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')();
const jwt = require('./utils/jwt');
const router = require('./server/index');
const koaBody = require('koa-body');
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024, // 设置上传文件大小最大限制，默认2M
  },
}));
app.use(bodyParser);
jwt(app);
app.use(router.routes());
app.listen(3000);

console.log('Server running on port 3000');
