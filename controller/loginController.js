const { User } = require('../database');
const PasswordEncrypt = require('../utils/passwordEncrypt');
const JWT = require('../utils/jwt');
const TokenBlacklist = require('../database/redis/tokenBlackList');
// 登录
exports.login = async function (req, res) {
  console.log(req.path, '1111');
  try {
    const { username, password } = req.body;

    // 验证请求体
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名或密码不能为空',
      });
    }

    // 查询用户
    const user = await User.findOne({ username });
    console.log('user', user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 验证密码
    const isPasswordValid = PasswordEncrypt.verify(password, user.password, user.salt);
    console.log('isPasswordValid', password, user.password, user.salt);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '密码错误',
      });
    }

    // 生成token
    const token = JWT.generateToken({
      id: user.uid,
      username: user.username,
    });

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
      },
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: err.message,
    });
  }
};

// 登出
exports.logout = async function (req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    // 解析token获取过期时间
    const decoded = JWT.verifyToken(token);
    if (decoded) {
      // 将token添加到黑名单
      await TokenBlacklist.add(token, decoded.exp);
    }
  }
  res.status(200).json({
    success: true,
    message: '登出成功',
  });
};
