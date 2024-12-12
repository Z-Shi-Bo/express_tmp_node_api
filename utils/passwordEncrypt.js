const crypto = require('crypto');

class PasswordEncrypt {
  /**
   * MD5加密
   * @param {string} password - 原始密码
   * @param {string} [salt=''] - 盐值，默认为空
   * @returns {string} - 返回加密后的密码
   */
  static encrypt(password, salt = '') {
    return crypto
      .createHash('md5')
      .update(password + salt)
      .digest('hex');
  }

  /**
   * 验证密码
   * @param {string} password - 原始密码
   * @param {string} encrypted - 加密后的密码
   * @param {string} [salt=''] - 盐值，默认为空
   * @returns {boolean} - 返回验证结果
   */
  static verify(password, encrypted, salt = '') {
    return this.encrypt(password, salt) === encrypted;
  }

  /**
   * 生成随机盐值
   * @param {number} [length=16] - 盐值长度
   * @returns {string} - 返回生成的盐值
   */
  static generateSalt(length = 16) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * 使用随机盐值加密（推荐使用）
   * @param {string} password - 原始密码
   * @returns {{encrypted: string, salt: string}} - 返回加密后的密码和盐值
   */
  static encryptWithSalt(password) {
    const salt = this.generateSalt();
    const encrypted = this.encrypt(password, salt);
    return { encrypted, salt };
  }
}

module.exports = PasswordEncrypt;
