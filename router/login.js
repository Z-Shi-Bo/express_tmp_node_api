const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
const { loginValidator } = require('../middleware/validator/userValidator');
/**
 * @swagger
 * tags:
 *   name: 登录
 *   description: 用户登录管理
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags: [登录]
 *     summary: 用户登录
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, description: 用户名 }
 *               password: { type: string, description: 密码 }
 */
router.post('/login', loginValidator, loginController.login);

/* POST 登出 */
router.post('/logout', loginController.logout);

module.exports = router;
