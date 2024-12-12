// 视频模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vodVideoId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Number,
      required: true,
      ref: 'User',
    },
    cover: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    collectCount: {
      type: Number,
      default: 0,
    },
    ...baseModel,
  },
  options,
);

// 添加索引以提升查询性能
videoSchema.index({ user: 1 });

module.exports = videoSchema;
