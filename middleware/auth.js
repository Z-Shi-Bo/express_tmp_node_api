const JWT = require('../utils/jwt');
const TokenBlacklist = require('../database/redis/tokenBlackList');
// 不需要token验证的接口路径
const publicPaths = [
  '/',
  '/api-docs', // Swagger UI 主页
  '/api-docs/', // Swagger UI 主页（带斜杠）
  '/api-docs/swagger-ui.css', // Swagger UI 样式文件
  '/api-docs/swagger-ui-bundle.js', // Swagger UI 主要 JavaScript 文件
  '/api-docs/swagger-ui-standalone-preset.js', // Swagger UI 预设配置文件
  '/api-docs/swagger-ui-init.js', // Swagger UI 初始化文件
  '/api-docs/favicon-32x32.png', // Swagger UI 32x32 网站图标
  '/api-docs/favicon-16x16.png', // Swagger UI 16x16 网站图标
  '/api/v1/users/register', // 用户注册接口
  '/api/v1/login', // 用户登录接口
];

module.exports = () => {
  return async (req, res, next) => {
    console.log(req.path);
    // 判断当前路径是否需要token验证
    if (publicPaths.includes(req.path)) {
      return next();
    }

    // 获取token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '请先登录',
      });
    }

    // 验证token是否失效
    const isInvalid = await TokenBlacklist.check(token);
    if (isInvalid) {
      return res.status(401).json({
        success: false,
        message: '认证令牌无效或已过期',
      });
    }

    // 验证token
    const decoded = JWT.verifyToken(token);
    console.log(decoded, 'decoded');
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: '认证令牌无效或已过期',
      });
    }

    // 将用户信息添加到请求对象中
    req.user = decoded;
    next();
  };
};
