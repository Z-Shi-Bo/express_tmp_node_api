require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
// token认证中间件
const auth = require('./middleware/auth');
const router = require('./router');
const config = require('./config');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// 初始化中间件
const initMiddleware = () => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use(express.static(path.join(__dirname, 'public')));

  // 需要token认证
  app.use(auth());
};

// 初始化视图引擎
const initViewEngine = () => {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
};

// 初始化数据库连接
const initDatabase = async () => {
  try {
    const dbUrl = `mongodb://${config.dbUser}:${config.dbPassword}@127.0.0.1:27017/express-tmp`;
    // 添加密码
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbUrl, {
      authSource: 'admin',
    });
    console.log('数据库连接成功');
  } catch (err) {
    console.error('数据库连接失败:', err);
    process.exit(1);
  }
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
};

// 初始化应用
const initApp = async () => {
  initViewEngine();
  initMiddleware();
  await initDatabase();

  // Swagger 配置和路由需要在其他路由之前
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API文档',
        version: '1.0.0',
      },
    },
    apis: ['./router/*.js'], // API文件路径
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // API 路由
  app.use(config.apiVersion, router);

  // 404处理
  app.use((req, res, next) => next(createError(404)));

  // 错误处理
  app.use(errorHandler);
};

// 启动应用
initApp().catch((err) => {
  console.error('应用初始化失败:', err);
  process.exit(1);
});

module.exports = app;
