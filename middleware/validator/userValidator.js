const { body, param, query } = require('express-validator');
const { validate } = require('./index');
const { User } = require('../../database');

// 登录验证规则
exports.loginValidator = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 2 })
    .withMessage('用户名长度不能小于2个字符')
    .isLength({ max: 8 })
    .withMessage('用户名长度不能大于8个字符'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6 })
    .withMessage('密码长度不能小于6个字符'),
]);

// 用户注册验证规则
exports.createUserValidator = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 2 })
    .withMessage('用户名长度不能小于2个字符')
    .isLength({ max: 8 })
    .withMessage('用户名长度不能大于8个字符')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject('用户名已被注册');
      }
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6 })
    .withMessage('密码长度不能小于6个字符'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('邮箱已被注册');
      }
    }),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('手机号不能为空')
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确')
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        return Promise.reject('手机号已被注册');
      }
    }),
]);

// 更新用户验证规则
exports.updateUserValidator = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 2 })
    .withMessage('用户名长度不能小于2个字符')
    .isLength({ max: 8 })
    .withMessage('用户名长度不能大于8个字符')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: value, uid: { $ne: req.body.uid } });
      if (user) {
        return Promise.reject('用户名已被注册');
      }
    }),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value, uid: { $ne: req.body.uid } });
      if (user) {
        return Promise.reject('邮箱已被注册');
      }
    }),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('手机号不能为空')
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ phone: value, uid: { $ne: req.body.uid } });
      if (user) {
        return Promise.reject('手机号已被注册');
      }
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6 })
    .withMessage('密码长度不能小于6个字符'),
]);
