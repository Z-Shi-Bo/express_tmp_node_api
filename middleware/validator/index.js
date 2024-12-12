const { validationResult } = require('express-validator');

// 统一的验证处理中间件
exports.validate = (validations) => {
  return async (req, res, next) => {
    // 执行所有验证规则
    await Promise.all(validations.map((validation) => validation.run(req)));

    // 获取验证结果
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 格式化错误信息
    const formatErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    // 返回错误信息
    return res.status(422).json({
      success: false,
      message: '输入验证失败',
      errors: formatErrors,
    });
  };
};
