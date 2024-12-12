// 基础模型

exports.baseModel = {
  createdAt: {
    type: Date,
    default: () => new Date(Date.now() + 8 * 60 * 60 * 1000), // 中国时间 UTC+8
    immutable: true, // 创建后不可修改
  },
  updatedAt: {
    type: Date,
    default: null,
  },
};

exports.options = {
  timestamps: true,
  timestamps: {
    currentTime: () => new Date(Date.now() + 8 * 60 * 60 * 1000),
  },
};
