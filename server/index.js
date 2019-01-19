const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

server = app.listen(3000, function(){
    console.log('server is running on port 3000')
});
app.use(express.static(path.join(__dirname, '../client/dist')));

let playerCount = 0;
let allPlayers = {};

io = socket(server);
io.on('connection', (socket) => {
    playerCount++;
    io.emit('NEW_USER', socket.id);
    io.emit('COUNT', playerCount);
    socket.on('NEW_USER', (data) => {
      allPlayers[data.userid] = data.username;
      console.log(allPlayers, 'dataa')
      // io.emit('RECEIVE_MESSAGE', data);
      io.emit('ALLPLAYERS', allPlayers)
    });
    console.log(socket.id, 'this be the id');
    socket.on('SEND', (data) => {
      console.log(data, 'dataa')
      io.emit('RECEIVE_MESSAGE', data);
    });
    socket.on('disconnect', () => {
      console.log('client disconnect...')
      playerCount--;
      io.emit('COUNT', playerCount);
      // handleDisconnect()
    })


    // client.on('register', handleRegister)

    // client.on('join', handleJoin)

    // client.on('leave', handleLeave)

    // client.on('message', handleMessage)

    // client.on('chatrooms', handleGetChatrooms)

    // client.on('availableUsers', handleGetAvailableUsers)

    // io.on('disconnect', function () {
    //   console.log('client disconnect...', client.id)
    //   playerCount--;
    //   io.emit('COUNT', playerCount);
    //   // handleDisconnect()
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