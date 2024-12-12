const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const vodController = require('../controller/vodController');
const uploadMiddleware = require('../middleware/upload');
const {
  vodVideoIdNotEmptyValidator,
  getVideoDetailValidator,
  createVideoValidator,
  commentVideoValidator,
  deleteCommentValidator,
} = require('../middleware/validator/videoValidator');
/**
 * @swagger
 * tags:
 *   name: 视频管理
 *   description: 视频管理
 */

/**
 * @swagger
 * /api/v1/video/upload:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 上传视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/upload', uploadMiddleware(), videoController.upload);

/**
 * @swagger
 * /api/v1/video/get-upload-auth:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 获取视频上传地址和认证
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/get-upload-auth', vodController.getUploadAuth);

/**
 * @swagger
 * /api/v1/video/create-video:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 创建视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/create-video', createVideoValidator, videoController.createVideo);

/**
 * @swagger
 * /api/v1/video/list:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 获取视频列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/list', videoController.getVideoList);

/**
 * @swagger
 * /api/v1/video/detail:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 获取视频详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/detail', getVideoDetailValidator, videoController.getVideoDetail);

/**
 * @swagger
 * /api/v1/video/comment:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 评论视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/comment', commentVideoValidator, videoController.commentVideo);

/**
 * @swagger
 * /api/v1/video/comment-list:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 获取视频评论列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/comment-list', videoController.getCommentList);

/**
 * @swagger
 * /api/v1/video/comment:
 *   delete:
 *     tags:
 *       - 视频管理
 *     summary: 删除视频评论
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.delete('/comment', deleteCommentValidator, videoController.deleteComment);

/**
 * @swagger
 * /api/v1/video/like:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 喜欢视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/like', vodVideoIdNotEmptyValidator, videoController.likeVideo);

/**
 * @swagger
 * /api/v1/video/dislike:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 不喜欢视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/dislike', vodVideoIdNotEmptyValidator, videoController.dislikeVideo);

/**
 * @swagger
 * /api/v1/video/like-list:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 喜欢的视频列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/like-list', videoController.getLikeList);

/**
 * @swagger
 * /api/v1/video/dislike-list:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 不喜欢的视频列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/dislike-list', videoController.getDislikeList);

/**
 * @swagger
 * /api/v1/video/collect:
 *   post:
 *     tags:
 *       - 视频管理
 *     summary: 收藏视频
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.post('/collect', vodVideoIdNotEmptyValidator, videoController.collectVideo);

/**
 * @swagger
 * /api/v1/video/hot:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 根据视频ID获取视频热度
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/hot', getVideoDetailValidator, videoController.getVideoHot);

/**
 * @swagger
 * /api/v1/video/hot-rank:
 *   get:
 *     tags:
 *       - 视频管理
 *     summary: 获取视频热度排名
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token认证
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/hot-rank', videoController.getVideoHotRank);

module.exports = router;
