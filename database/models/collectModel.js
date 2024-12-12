// 视频收藏模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const collectSchema = new mongoose.Schema(
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
    ...baseModel,
  },
  options,
);

module.exports = collectSchema;
