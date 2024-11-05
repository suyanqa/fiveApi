// 引入依赖模块
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user'); // 引入用户模型

// 注册路由
router.post('/register', async (req, res) => {
  const { user_id, username, password, email } = req.body;

  // 验证所有必填字段
  if (!user_id || !username || !password || !email) {
    return res.status(400).json({ error: '所有字段均为必填项' });
  }

  try {
    // 检查用户ID或邮箱是否已存在
    const existingUser = await User.findOne({ $or: [{ user_id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: '用户ID或邮箱已被使用' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = new User({
      user_id: user_id,
      username: username,
      password: hashedPassword,
      email: email,
    });

    // 保存用户到数据库
    await newUser.save();

    // 返回成功信息
    res.status(201).json({ message: '用户注册成功' });
  } catch (error) {
    console.error('注册时出现错误：', error);
    res.status(500).json({ message: '注册失败，请稍后再试' });
  }
});

module.exports = router;
