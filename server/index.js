const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

server = app.listen(3000, function(){
    console.log('server is running on port 3000')
});
app.use(express.static(path.join(__dirname, '../client/dist')));

let serverPasscode;
let allPlayers = []; 
let playerCount;
let assignedPrompts = [];
let assigned = false;
let allPrompts = ['One word to describe yourself', 'Most epic sandwich name', 'Worst Starbucks drink', 'Best excuse to missing work', 'dummy', 'yeajsdhf', 'asdlfjaldskjf', 'abrrrrrr'];


io = socket(server);
io.on('connection', (socket) => {
    // playerCount++;
    // allUserIds.push(socket.id);
    // userId[socket.id] = {};
    // userId[socket.id]['hello'] = 'testing';
    // userPrompts[socket.id] = 0;
    io.emit('NEW_USER', socket.id);
    io.emit('COUNT', playerCount);
    if(serverPasscode) {io.emit('PASSCODE', serverPasscode);}

    socket.on('JOIN_GAME', (data) => {
      let passcode = data.passcode;
      let userObj = data.newuser;
      if(!serverPasscode){
        serverPasscode = passcode;
        allPlayers.push(userObj);
        io.emit('ALLPLAYERS', allPlayers)
        playerCount = allPlayers.length;
      }
      else if (serverPasscode === passcode){
        allPlayers.push(userObj);
        io.emit('ALLPLAYERS', allPlayers);
        playerCount = allPlayers.length;
      } else {
        socket.emit('DENIED_ACCESS', {"error" : "wrong passcode"})
      }

        if(playerCount === 4 && assigned === false){ // assign random prompts to two users for comparison
          // idiot figure out a function asap
          // console.log('its hitting')
            let randomPrompt = Math.floor(Math.random() * (allPrompts.length + 1));
            allPlayers[0].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[1].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length + 1));
            allPlayers[2].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[3].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length + 1));
            allPlayers[0].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[2].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length + 1));
            allPlayers[1].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[3].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            assigned = true;
            // console.log('count', allPlayers)
            io.emit('ALLPLAYERS', allPlayers)
        } 
    })

    // socket.on('NEW_USER', (data) => {
    //   allPlayers[data.userid] = data.username; //saving socketid username pairs
    //   console.log(allPlayers, 'dataa')
    //   // io.emit('RECEIVE_MESSAGE', data);
    //   io.emit('ALLPLAYERS', allPlayers)

   
    socket.on('SEND', (data) => {
      console.log(data, 'dataa')
      io.emit('RECEIVE_MESSAGE', data);
    });
    socket.on('disconnect', () => {
      console.log('client disconnect...', socket.id)
      let leftUser = socket.id
      for(let i = 0; i < allPlayers.length; i++){
        if(allPlayers[i][leftUser]){
          allPlayers.splice(i, 1);
        }
      }
      io.emit('ALLPLAYERS', allPlayers)
      // handleDisconnect()
    })
});

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