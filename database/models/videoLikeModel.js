// 视频评论模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const videoLikeSchema = new mongoose.Schema(
  {
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
    like: {
      type: Number,
      enum: [1, -1],
    },
    ...baseModel,
  },
  options,
);

module.exports = videoLikeSchema;
