const Store = require('./index');

// 视频热度机制
// 观看 +1 点赞 +2 收藏 +3 评论 +3
class VideoHot {
  static typeMap = {
    watch: 1,
    like: 2,
    collect: 3,
    comment: 3,
  };

  // 添加视频热度
  static async add(videoId, type) {
    const data = await Store.zscore('video_hot', videoId);
    console.log(data, 1111);
    if (data) {
      await Store.zincrby('video_hot', this.typeMap[type], videoId);
    } else {
      await Store.zadd('video_hot', this.typeMap[type], videoId);
    }
  }

  // 获取某个视频的热度
  static async get(videoId) {
    return await Store.zscore('video_hot', videoId);
  }

  // 获取视频热度排行榜
  static async getRankList(limit = 10) {
    const data = await Store.zrevrange('video_hot', 0, limit - 1, 'WITHSCORES');
    const result = [];
    for (let i = 0; i < data.length; i += 2) {
      result.push({
        videoId: data[i],
        hot: data[i + 1],
      });
    }
    return result;
  }
}

module.exports = VideoHot;
