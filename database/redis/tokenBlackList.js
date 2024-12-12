const Store = require('./index');

// 黑名单
class TokenBlacklist {
  static async add(token, exp) {
    const timeToExpire = exp * 1000 - Date.now();
    if (timeToExpire > 0) {
      await Store.set(`bl_${token}`, '1', 'PX', timeToExpire);
    }
  }

  // 检查token是否在黑名单中
  static async check(token) {
    return await Store.exists(`bl_${token}`);
  }
}

module.exports = TokenBlacklist;
