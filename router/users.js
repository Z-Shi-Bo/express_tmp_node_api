const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { createUserValidator, updateUserValidator } = require('../middleware/validator/userValidator');

/**
 * @swagger
 * tags:
 *   name: 用户
 *   description: 用户管理
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取用户列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/', userController.getUser);

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - 用户
 *     summary: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 minLength: 2
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 description: 密码
 *                 minLength: 6
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 pattern: '^1[3-9]\d{9}$'
 *               email:
 *                 type: string
 *                 description: 邮箱
 *                 format: email
 *     responses:
 *       200:
 *         description: 注册成功
 *       400:
 *         description: 参数错误
 */
router.post('/register', createUserValidator, userController.registerUser);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     tags:
 *       - 用户
 *     summary: 更新用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 minLength: 2
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 description: 密码
 *                 minLength: 6
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 pattern: '^1[3-9]\d{9}$'
 *               email:
 *                 type: string
 *                 description: 邮箱
 *                 format: email
 *     responses:
 *       200:
 *         description: 更新成功
 *       400:
 *         description: 参数错误
 */
router.put('/', updateUserValidator, userController.updateUser);

/**
 * @swagger
 * /api/v1/users/subscribe:
 *   post:
 *     tags:
 *       - 用户
 *     summary: 订阅用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/subscribe', userController.subscribeUser);

/**
 * @swagger
 * /api/v1/users/unsubscribe:
 *   post:
 *     tags:
 *       - 用户
 *     summary: 取消订阅
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/unsubscribe', userController.unsubscribeUser);

/**
 * @swagger
 * /api/v1/users/getSubscribedDetail:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取订阅详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/getSubscribedDetail', userController.getSubscribedDetail);

/**
 * @swagger
 * /api/v1/users/getSubscribedList:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取订阅列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/getSubscribedList', userController.getSubscribedList);

/**
 * @swagger
 * /api/v1/users/getFollowers:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取当前用户的关注者
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/getFollowers', userController.getFollowers);

module.exports = router;
