const { body, query } = require('express-validator');
const { validate } = require('./index');

const vodVideoIdNotEmptyValidator = body('vodVideoId').trim().notEmpty().withMessage('视频ID不能为空').bail();

// 视频ID不能为空规则
exports.vodVideoIdNotEmptyValidator = validate([vodVideoIdNotEmptyValidator]);

// 创建视频验证规则
exports.createVideoValidator = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('视频标题不能为空')
    .bail()
    .isLength({ max: 20 })
    .withMessage('视频标题长度不能超过20个字符')
    .bail(),
  vodVideoIdNotEmptyValidator,
]);

// 获取视频详情验证规则
exports.getVideoDetailValidator = validate([
  query('vodVideoId').trim().notEmpty().withMessage('视频ID不能为空').bail(),
]);

// 评论视频验证规则
exports.commentVideoValidator = validate([
  vodVideoIdNotEmptyValidator,
  body('content').trim().notEmpty().withMessage('评论内容不能为空').bail(),
]);

// 删除视频评论验证规则
exports.deleteCommentValidator = validate([
  query('vodVideoId').trim().notEmpty().withMessage('视频ID不能为空').bail(),
  query('commentId').trim().notEmpty().withMessage('评论ID不能为空').bail(),
]);
