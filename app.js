// app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connect = require('./config/db');
const user = require('./routes/user.js')
const authenticateToken =  require('./middleware/auth');

var app = express();
const api = '/api'
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateToken);
app.use(api,user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page or return json
  if (err.status === 404) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  } else {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

// 规范化端口
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// 获取端口号
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// 事件监听器 for HTTP server "error" event. 
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      break;
    default:
      throw error;
  }
}

// 事件监听器 for HTTP server "listening" event.
function onListening(server) {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

connect()
  .then(() => {
    // 数据库连接成功后启动服务器
    const server = app.listen(port, () => {
      onListening(server);
    });

    server.on('error', onError);
  })
  .catch((err) => {
    // 数据库连接失败处理
    console.error('Database connection failed:', err);
    process.exit(1); // 退出进程
  });

module.exports = app;