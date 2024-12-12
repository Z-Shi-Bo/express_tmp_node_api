const jwt = require('jsonwebtoken');

const SECRET_KEY = '550e8400-e29b-41d4-a716-446655440000'; // UUID格式的密钥
const EXPIRES_IN = '24h'; // 过期时间

class JWT {
  // 生成token
  static generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
  }

  // 验证token 返回包含过期时间的存储信息
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return null;
    }
  }
}

module.exports = JWT;
