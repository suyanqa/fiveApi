// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/user'); // 引入用户模型
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'b820430bfae8594c033714b8d8c43b71'; // 用于JWT签名的密钥

// 用户登录路由
router.post('/login', async (req, res) => {
  const { user_id, passwd, nick_name, reCAPTCHA, grant_type, username, password, public_key } = req.body;

  console.log(user_id, passwd, nick_name, reCAPTCHA, grant_type, username, password, public_key);
  // 检查 grant_type 是否为 'password'
  if (grant_type !== 'password') {
    return res.status(400).json({ error: 'unsupported_grant_type', error_description: 'The grant type is not supported' });
  }

  // 查找用户
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'The user does not exist' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid username or password' });
    }

    // 创建JWT令牌
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // 返回令牌
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/1',async (req,res) => {
    console.log("get被调用");
    return res.send("ok")
})

module.exports = router;