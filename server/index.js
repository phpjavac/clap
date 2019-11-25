const Router = require('koa-router');
const userctrl = require('../controllers/user/UserController');

const router = new Router();
router.post('/api/user/login', userctrl.login);

module.exports = router;
