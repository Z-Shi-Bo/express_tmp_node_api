const { VodVideo, VideoComment, VideoLike, Collect } = require('../database');
const VideoHot = require('../database/redis/videoHot');

// 上传视频
exports.upload = async function (req, res) {
  try {
    res.status(200).json({
      success: true,
      message: '上传成功',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '上传失败',
      error: err.message,
    });
  }
};

// 创建视频
exports.createVideo = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: '请先登录',
    });
  }
  try {
    req.body.user = req.user.id;
    const video = new VodVideo(req.body);
    await video.save();
    res.status(200).json({
      success: true,
      message: '创建视频成功',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: '创建视频失败',
      error: error.message,
    });
  }
};
// 获取视频列表-分页
exports.getVideoList = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10 } = req.query;
    const videoList = await VodVideo.find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate({ path: 'user', foreignField: 'uid', localField: 'user' });
    const total = await VodVideo.countDocuments();
    res.status(200).json({
      success: true,
      message: '获取视频列表成功',
      data: videoList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取视频列表失败',
      error: error.message,
    });
  }
};

// 根据vodVideoId获取视频详情
exports.getVideoDetail = async (req, res) => {
  try {
    const video = await VodVideo.findOne({ _id: req.query.vodVideoId }).populate({
      path: 'user',
      foreignField: 'uid',
      localField: 'user',
      select: 'username cover avatar -_id -password',
    });
    if (video) {
      await VideoHot.add(video._id, 'watch');
    }
    res.status(200).json({
      success: true,
      message: '获取视频详情成功',
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取视频详情失败',
      error: error.message,
    });
  }
};

// 评论视频
exports.commentVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vodVideoId, content } = req.body;
    // 判断视频是否存在
    const video = await VodVideo.findOne({ _id: vodVideoId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在',
      });
    }
    const videoComment = new VideoComment({
      user: userId,
      video: vodVideoId,
      content,
    });
    const commentId = await videoComment.save();
    if (commentId) {
      video.commentCount += 1;
      await video.save();
      await VideoHot.add(vodVideoId, 'comment');
    }
    res.status(200).json({
      success: true,
      message: '评论视频成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '评论视频失败',
      error: error.message,
    });
  }
};

// 获取视频评论列表
exports.getCommentList = async (req, res) => {
  try {
    const { vodVideoId, pageNum = 1, pageSize = 10 } = req.body;
    const commentList = await VideoComment.find({ video: vodVideoId })
      .select('-_id -__v -updatedAt -createdAt+')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: 'user',
        foreignField: 'uid',
        localField: 'user',
        select: 'username avatar cover -password -_id',
      });
    const total = await VideoComment.countDocuments({ video: vodVideoId });
    res.status(200).json({
      success: true,
      message: '获取视频评论列表成功',
      data: commentList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取视频评论列表失败',
      error: error.message,
    });
  }
};
// 删除视频评论
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vodVideoId, commentId } = req.query;
    // 先判断视频是否存在
    const video = await VodVideo.findById(vodVideoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在',
      });
    }
    // 判断评论是否存在
    const comment = await VideoComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在',
      });
    }
    // 在判断评论是否属于该视频
    if (comment.video.toString() !== vodVideoId) {
      return res.status(403).json({
        success: false,
        message: '评论不属于该视频',
      });
    }
    // 判断删除评论的用户是否是当前登录用户
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权限删除评论',
      });
    }
    await VideoComment.findByIdAndDelete(commentId);
    video.commentCount -= 1;
    await video.save();
    res.status(200).json({
      success: true,
      message: '删除视频评论成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除视频评论失败',
      error: error.message,
    });
  }
};

// 通用的视频互动处理函数
const handleVideoInteraction = async (userId, vodVideoId, likeValue) => {
  // 判断视频是否存在
  const video = await VodVideo.findById(vodVideoId);
  if (!video) {
    const error = new Error('视频不存在');
    error.status = 404;
    throw error;
  }

  // 判断用户是否已经操作过该视频
  const isLike = await VideoLike.findOne({ user: userId, video: vodVideoId });
  if (isLike && isLike.like === likeValue) {
    await VideoLike.findByIdAndDelete(isLike._id);
  } else if (isLike) {
    isLike.like = likeValue;
    await isLike.save();
  } else {
    const videoLike = new VideoLike({
      user: userId,
      video: vodVideoId,
      like: likeValue,
    });
    await videoLike.save();
  }

  // 更新视频的喜欢和不喜欢数量
  video.likeCount = await VideoLike.countDocuments({ video: vodVideoId, like: 1 });
  video.dislikeCount = await VideoLike.countDocuments({ video: vodVideoId, like: -1 });
  const videoId = await video.save();
  if (videoId && likeValue === 1) {
    await VideoHot.add(vodVideoId, 'like');
  }
};

// 喜欢视频
exports.likeVideo = async (req, res) => {
  try {
    await handleVideoInteraction(req.user.id, req.body.vodVideoId, 1);
    res.status(200).json({
      success: true,
      message: '操作成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error.message,
    });
  }
};

// 不喜欢视频
exports.dislikeVideo = async (req, res) => {
  try {
    await handleVideoInteraction(req.user.id, req.body.vodVideoId, -1);
    res.status(200).json({
      success: true,
      message: '操作成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error.message,
    });
  }
};

// 通用的获取视频列表函数
const getVideoList = async (userId, likeValue, pageNum = 1, pageSize = 10) => {
  const videoList = await VideoLike.find({ user: userId, like: likeValue })
    .select('like -_id')
    .populate({
      path: 'video',
      select: 'vodVideoId title description cover -_id',
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);
  const total = await VideoLike.countDocuments({ user: userId, like: likeValue });
  return { videoList, total };
};

// 获取喜欢的视频列表
exports.getLikeList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pageNum = 1, pageSize = 10 } = req.query;
    const { videoList, total } = await getVideoList(userId, 1, pageNum, pageSize);
    res.status(200).json({
      success: true,
      message: '操作成功',
      data: videoList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error.message,
    });
  }
};

// 获取不喜欢的视频列表
exports.getDislikeList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pageNum = 1, pageSize = 10 } = req.query;
    const { videoList, total } = await getVideoList(userId, -1, pageNum, pageSize);
    res.status(200).json({
      success: true,
      message: '操作成功',
      data: videoList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error.message,
    });
  }
};

// 收藏视频
exports.collectVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vodVideoId } = req.body;
    // 判断视频是否存在
    const video = await VodVideo.findById(vodVideoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在',
      });
    }
    // 判断用户是否已经收藏过该视频
    const isCollect = await Collect.findOne({ user: userId, video: vodVideoId });
    if (isCollect) {
      return res.status(400).json({
        success: false,
        message: '已收藏',
      });
    }
    const collect = new Collect({
      user: userId,
      video: vodVideoId,
    });
    const collectId = await collect.save();
    if (collectId) {
      video.collectCount += 1;
      await video.save();
      await VideoHot.add(vodVideoId, 'collect');
    }
    res.status(200).json({
      success: true,
      message: '操作成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error.message,
    });
  }
};

// 根据视频ID获取视频热度
exports.getVideoHot = async (req, res) => {
  try {
    const { vodVideoId } = req.query;
    const hot = await VideoHot.get(vodVideoId);
    res.status(200).json({
      success: true,
      message: '获取视频热度成功',
      data: {
        videoId: vodVideoId,
        hot,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取视频热度失败',
      error: error.message,
    });
  }
};

// 获取视频热度排名
exports.getVideoHotRank = async (req, res) => {
  try {
    const hotRank = await VideoHot.getRankList();
    res.status(200).json({
      success: true,
      message: '获取视频热度排名成功',
      data: hotRank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取视频热度排名失败',
      error: error.message,
    });
  }
};
