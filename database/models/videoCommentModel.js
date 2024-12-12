// 视频评论模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const videoCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
      ref: 'User',
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'VodVideo',
    },
    ...baseModel,
  },
  options,
);

module.exports = videoCommentSchema;
