// 订阅模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const subscribeSchema = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
      ref: 'User',
    },
    subscribedUser: {
      type: Number,
      required: true,
      ref: 'User',
    },
    ...baseModel,
  },
  options,
);

// 添加索引以提升查询性能
subscribeSchema.index({ user: 1 });
subscribeSchema.index({ subscribedUser: 1 });

module.exports = subscribeSchema;
