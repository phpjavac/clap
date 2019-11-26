const Router = require('koa-router');
const userctrl = require('../controllers/user/UserController');

const router = new Router();
router
    .post('/api/user/login', userctrl.login)
    .post('/api/user/register', userctrl.register)
    .get('/api/user/list', userctrl.list)
    .get('/api/user/userInfo', userctrl.userInfo);

module.exports = router;
