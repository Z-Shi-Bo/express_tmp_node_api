// 计数器模型

const mongoose = require('mongoose');
const { baseModel, options } = require('./baseModel');

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
    ...baseModel,
  },
  options,
);

module.exports = mongoose.model('Counter', counterSchema);
