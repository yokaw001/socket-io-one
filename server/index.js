var express = require('express');
var app = express();
var path = require('path');

server = app.listen(3000, function(){
    console.log('server is running on port 3000')
});
app.use(express.static(path.join(__dirname, '../client/dist')));


var socket = require('socket.io');
io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('SEND_MESSAGE', function(data){
      io.emit('RECEIVE_MESSAGE', data);
    })
    // client.on('register', handleRegister)

    // client.on('join', handleJoin)

    // client.on('leave', handleLeave)

    // client.on('message', handleMessage)

    // client.on('chatrooms', handleGetChatrooms)

    // client.on('availableUsers', handleGetAvailableUsers)

    // client.on('disconnect', function () {
    //   console.log('client disconnect...', client.id)
    //   handleDisconnect()
    // })

    // client.on('error', function (err) {
    //   console.log('received error from client:', client.id)
    //   console.log(err)
    // })
});

// const server = require('http').createServer()
// const io = require('socket.io')(server)

// io.on('connection', function (client) {
//   client.on('register', handleRegister)

//   client.on('join', handleJoin)

//   client.on('leave', handleLeave)

//   client.on('message', handleMessage)

//   client.on('chatrooms', handleGetChatrooms)

//   client.on('availableUsers', handleGetAvailableUsers)

//   client.on('disconnect', function () {
//     console.log('client disconnect...', client.id)
//     handleDisconnect()
//   })

//   client.on('error', function (err) {
//     console.log('received error from client:', client.id)
//     console.log(err)
//   })
// })

// server.listen(3000, function (err) {
//   if (err) throw err
//   console.log('listening on port 3000')
// })