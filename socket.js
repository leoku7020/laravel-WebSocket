var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis();
var user = Array();

redis.subscribe('notification', function(err, count) {
  console.log('connect!');
});

io.on('connection', function(socket) {
  // 當使用者觸發 login 時將他加入 notification 的 room
  socket.on('login', function(data) {
    console.log('user:'+data.user+' login '+'token = '+data.token);
    socket.join('notification');
    user[data.token] = data.user;
  });
});

redis.on('message', function(channel, notification) {
  console.log(notification);
  notification = JSON.parse(notification);

  // 將訊息推播全使用者
  var name = user[notification.data.token];
  var message = name + ' : ' + notification.data.message;
  io.emit('notification', message);
  // // 使用 to() 指定傳送的 room，也就是傳遞給指定的使用者
  // io.to('token:' + notification.data.token).emit(
  //   'notification',
  //   notification.data.message
  // );
});

// 監聽 3000 port
http.listen(3000, function() {
  console.log('Listening on Port 3000');
});