$(document).ready(function(){
    var io = require('socket.io-client');
    // 建立 socket.io 的連線
    var notification = io.connect('http://localhost:3000');

    // 當連接到 socket.io server 時觸發 set-token 設定使用者的 room
    notification.on('connect', function() {
      notification.emit('login', {
        'token' : Notification.TOKEN, 
        'user' : Notification.USER
        });
    });

    // 當從 socket.io server 收到 notification 時將訊息印在 console 上
    notification.on('notification', function(message) {
      console.log(message);
      $('.card-body').append('<p>'+message+'</p><br>');
    });
});


