const Router = require('koa-router');
const userctrl = require('../controllers/user/UserController');
const classctrl = require('../controllers/class/ClassController');

const router = new Router();
/**
     * 用户模块
     */
router
    .post('/api/user/login', userctrl.login)
    .post('/api/user/register', userctrl.register)
    .get('/api/user/list', userctrl.list)
    .get('/api/user/userInfo', userctrl.userInfo)
    .put('/api/user/put', userctrl.put)
    .delete('/api/user/deluser', userctrl.deluser)
    .post('/api/user/uploadUser', userctrl.uploadUser);
/**
     * 班级模块
     */
router
    .post('/api/class/addClass', classctrl.addClass)
    .get('/api/class/classlist', classctrl.classList)
    .delete('/api/class/delClass', classctrl.delClass);

module.exports = router;
