const mongoose = require('mongoose');

module.exports = {
  User: mongoose.model('User', require('./models/userModel')),
  VodVideo: mongoose.model('VodVideo', require('./models/videoModel')),
  Subscribe: mongoose.model('Subscribe', require('./models/subscribeModel')),
  VideoComment: mongoose.model('VideoComment', require('./models/videoCommentModel')),
  VideoLike: mongoose.model('VideoLike', require('./models/videoLikeModel')),
  Collect: mongoose.model('Collect', require('./models/collectModel')),
};
