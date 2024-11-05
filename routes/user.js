// userRegister.js
const express = require('express');
const router = express.Router();
const User = require('../model/user'); // 引入用户模型
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'b820430bfae8594c033714b8d8c43b71'; // 用于JWT签名的密钥

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: '用户不存在' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '密码错误' });
    }
    /**
     * 检查public_key是否为空
     * */
    if (!user.public_key) {
      return res.status(400).json({ error: '请求载荷中的 public_key 为空' });
    }

    // 创建JWT令牌
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // 构建响应对象
    const response = {
      access_token: token,  // JWT 令牌
      token_type: 'Bearer', // 令牌类型
      expires_in: 3600,     // 过期时间（秒）
      refresh_token: '8xLOxBtZp8', // 假设的刷新令牌
      encrypted_data: 1     // 这个字段的具体内容你可以根据需要修改
    };

    // 返回响应
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/register', async (req, res) => {
  const { user_id, username, password, email } = req.body;

  // 验证所有必填字段
  if (!user_id || !username || !password || !email) {
    return res.status(400).json({ error: '所有字段均为必填项' });
  }

  try {
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
