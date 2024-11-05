const jwt = require('jsonwebtoken');

const JWT_SECRET = 'b820430bfae8594c033714b8d8c43b71';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 从请求头获取令牌

    // 放行登录和注册接口
    if (req.path === '/api/login' || req.path === '/api/register') {
        return next();
    }

    // 未携带令牌返回
    if (!token) return res.sendStatus(401).json({
        message:"请检查是否携带token"
    });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({
            message:"令牌无效或已过期"
        }); // 如果令牌无效，返回403

        req.user = user; // 将用户信息添加到请求对象上
        next();
    });
};

module.exports = authenticateToken;
