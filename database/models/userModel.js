// 用户模型

const mongoose = require('mongoose');
const Counter = require('./counterModel');

const { baseModel, options } = require('./baseModel');

const userSchema = new mongoose.Schema(
  {
    // 用户唯一标识 自增且自动生成
    uid: {
      type: Number,
      unique: true,
      immutable: true, // 创建后不可修改
    },
    username: {
      type: String,
      required: true,
      trim: true, // 去除首尾空格
      minlength: 2, // 最小长度
      maxlength: 50, // 最大长度
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // 最小长度
      select: true, // 查询时默认返回密码字段
    },
    // 加密密码的盐值  iv
    salt: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^1[3-9]\d{9}$/, '请输入有效的手机号'], // 必须以1开头,第二位3-9,后面9位数字
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // 转换为小写
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址'], // 邮箱格式验证
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    cover: {
      type: String,
      default: null,
    },
    channelDescription: {
      type: String,
      default: null,
    },
    // 被订阅数
    subscribed: {
      type: Number,
      default: 0,
    },
    ...baseModel,
  },
  options,
);

// 添加索引以提升查询性能
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ uid: 1 });
userSchema.index({ subscribed: 1 });
userSchema.pre('save', async function (next) {
  // 只在文档新增时自增 uid
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      this.uid = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = userSchema;
