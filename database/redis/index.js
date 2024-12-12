const Redis = require('ioredis');

// 添加权限
const Store = new Redis({ password: '123456' });

Store.on('error', (err) => {
  if (err) {
    console.error('Redis 连接失败', err);
    Store.quit();
  }
});

Store.on('ready', () => {
  console.log('Redis 连接成功');
});

module.exports = Store;
