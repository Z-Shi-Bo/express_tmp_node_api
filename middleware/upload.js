const multer = require('multer');
const path = require('path');

module.exports = (options = {}) => {
  // 配置 multer 存储
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // 设置文件存储路径
      const uploadPath = options.dest || 'public/uploads';
      // 调用 cb 函数，将文件存储到指定目录
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // 生成文件名：时间戳 + 原始文件扩展名
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  // 文件过滤器
  const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = options.allowedTypes || [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/mpeg',
      'video/mpg',
      'video/m4v',
      'video/webm',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'));
    }
  };

  // 修改 multer 配置，增加大文件处理相关选项
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxSize || 2 * 1024 * 1024 * 1024, // 默认最大2GB
      fieldSize: 100 * 1024 * 1024, // 字段大小限制为100MB
    },
  });

  return async (req, res, next) => {
    try {
      // 添加上传进度监听
      let progress = 0;
      req.on('data', (chunk) => {
        progress += chunk.length;
        // 可以通过 WebSocket 或 SSE 将进度发送给前端
        console.log(`上传进度: ${progress} bytes`);
      });

      await new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
          if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              reject(new Error('文件大小超出限制'));
            } else {
              reject(err);
            }
          } else {
            resolve();
          }
        });
      });

      // 检查文件是否上传成功
      if (!req.file) {
        return next(new Error('文件上传失败'));
      }

      // 调用下一步中间件
      next();
    } catch (err) {
      next(err);
    }
  };
};
