const express = require('express');
const router = express.Router();

// 登录
router.use('/', require('./login'));

// 用户
router.use('/users', require('./users'));

// 上传
router.use('/video', require('./video'));

module.exports = router;
