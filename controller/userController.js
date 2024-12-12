const { User, Subscribe } = require('../database');
const PasswordEncrypt = require('../utils/passwordEncrypt');

// 获取用户列表
exports.getUser = async function (req, res) {
  try {
    const users = await User.find({})
      .select('-__v -_id -salt -password') // 排除不需要的字段
      .lean(); // 转换为普通JS对象,提升性能

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: err.message,
    });
  }
};

// 用户注册
exports.registerUser = async function (req, res) {
  try {
    // 验证请求体
    if (!req.body?.username) {
      return res.status(400).json({
        success: false,
        message: '用户名不能为空',
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户已存在',
      });
    }

    // 加密密码
    const { encrypted, salt } = PasswordEncrypt.encryptWithSalt(req.body.password);

    // 创建并保存新用户
    const newUser = new User({
      ...req.body,
      password: encrypted,
      salt,
      createdAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 中国时间 UTC+8
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: '用户注册成功',
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({
      success: false,
      message: '用户注册失败',
      error: err.message,
    });
  }
};

// 更新用户
exports.updateUser = async function (req, res) {
  try {
    const { uid, password, ...updateData } = req.body;

    // 验证请求体
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: '用户id不能为空',
      });
    }
    // 加密密码
    const { encrypted, salt } = PasswordEncrypt.encryptWithSalt(password);

    // 使用findOneAndUpdate直接更新用户
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      {
        ...updateData,
        password: encrypted,
        salt,
        updatedAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 中国时间 UTC+8
      },
      { new: true }, // 返回更新后的文档
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: '未找到该用户',
      });
    }

    res.status(200).json({
      success: true,
      message: '用户更新成功',
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      success: false,
      message: '更新用户失败',
      error: err.message,
    });
  }
};

// 订阅用户
exports.subscribeUser = async function (req, res) {
  try {
    const userId = req.user.id;
    const subscribedUser = req.body.subscribedUser;
    // 判断是不是自己订阅的自己
    if (userId === subscribedUser) {
      return res.status(400).json({
        success: false,
        message: '不能订阅自己',
      });
    }

    // 判断是否已经订阅
    const isSubscribed = await Subscribe.findOne({ user: userId, subscribedUser: subscribedUser });
    if (isSubscribed) {
      return res.status(401).json({
        success: false,
        message: '已经订阅，请勿重复订阅',
      });
    }

    // 创建订阅
    const newSubscribe = new Subscribe({
      user: userId,
      subscribedUser: subscribedUser,
    });
    await newSubscribe.save();

    // 更新被订阅者的订阅数
    await User.findOneAndUpdate({ uid: subscribedUser }, { $inc: { subscribed: 1 } });

    res.status(201).json({
      success: true,
      message: '订阅成功',
    });
  } catch (err) {
    console.error('Error subscribing user:', err);
    res.status(500).json({
      success: false,
      message: '订阅失败',
      error: err.message,
    });
  }
};

// 取消订阅
exports.unsubscribeUser = async function (req, res) {
  try {
    const userId = req.user.id;
    const subscribedUser = req.body.subscribedUser;
    // 判断是否已经订阅
    const isSubscribed = await Subscribe.findOne({ user: userId, subscribedUser: subscribedUser });
    if (!isSubscribed) {
      return res.status(401).json({
        success: false,
        message: '未订阅，请先订阅',
      });
    }

    // 删除订阅
    await Subscribe.findOneAndDelete({ user: userId, subscribedUser: subscribedUser });

    // 更新被订阅者的订阅数
    await User.findOneAndUpdate({ uid: subscribedUser }, { $inc: { subscribed: -1 } });

    res.status(200).json({
      success: true,
      message: '取消订阅成功',
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    res.status(500).json({
      success: false,
      message: '取消订阅失败',
      error: error.message,
    });
  }
};

// 获取订阅详情
exports.getSubscribedDetail = async function (req, res) {
  try {
    const userId = req.user.id;
    const subscribedUser = req.query.subscribedUser;
    if (!subscribedUser) {
      return res.status(400).json({
        success: false,
        message: '订阅用户不能为空',
      });
    }

    const isSubscribed = await Subscribe.find({ user: userId, subscribedUser: subscribedUser });

    const subscribedUserInfo = await User.findOne({ uid: subscribedUser }).select(
      'uid username channelDescription subscribed cover avatar -_id -password',
    );

    res.status(200).json({
      success: true,
      data: {
        isSubscribed: isSubscribed.length > 0,
        subscribedUserInfo,
      },
    });
  } catch (error) {
    console.error('Error getting subscribed:', error);
    res.status(500).json({
      success: false,
      message: '获取订阅失败',
      error: error.message,
    });
  }
};

// 获取订阅列表
exports.getSubscribedList = async function (req, res) {
  try {
    const userId = req.user.id;
    const { pageNum = 1, pageSize = 10 } = req.query;
    const subscribedList = await Subscribe.find({ user: userId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const total = await Subscribe.countDocuments({ user: userId });
    if (subscribedList.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: '当前用户没有订阅',
      });
    }
    // 获取订阅列表中的用户信息
    const subscribedUserInfoList = await User.find({
      uid: { $in: subscribedList.map((id) => id.subscribedUser) },
    }).select('uid username channelDescription subscribed cover avatar -_id -password');

    res.status(200).json({
      success: true,
      data: subscribedUserInfoList,
      total,
    });
  } catch (error) {
    console.error('Error getting subscribed list:', error);
    res.status(500).json({
      success: false,
      message: '获取订阅列表失败',
      error: error.message,
    });
  }
};
// 获取当前用户的关注者
exports.getFollowers = async function (req, res) {
  try {
    const userId = req.user.id;
    const { pageNum = 1, pageSize = 10 } = req.query;
    const followers = await Subscribe.find({ subscribedUser: userId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const total = await Subscribe.countDocuments({ subscribedUser: userId });
    if (followers.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: '当前用户没有关注者',
      });
    }
    const followersInfo = await User.find({
      uid: { $in: followers.map((id) => id.user) },
    }).select('uid username channelDescription subscribed cover avatar -_id -password');

    res.status(200).json({
      success: true,
      data: followersInfo,
      total,
    });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({
      success: false,
      message: '获取关注者失败',
      error: error.message,
    });
  }
};
