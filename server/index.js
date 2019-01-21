const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

server = app.listen(3000, function(){
    console.log('server is running on port 3000')
});
app.use(express.static(path.join(__dirname, '../client/dist')));

let serverPasscode;
let allPlayers = []; // same as below check 
let playerCount = allPlayers.length;
let games = [];
let assignedPrompts = [];
// let allUserIds = []; // do i need it if i do then delete entry on disc?
// let userId = {};
let assigned = false;
let allPrompts = ['One word to describe yourself', 'Most epic sandwich name', 'Worst Starbucks drink', 'Best excuse to missing work', 'dummy', 'yeajsdhf', 'asdlfjaldskjf', 'abrrrrrr'];




io = socket(server);
io.on('connection', (socket) => {
    // playerCount++;
    // allUserIds.push(socket.id);
    userId[socket.id] = {};
    // userId[socket.id]['hello'] = 'testing';
    // userPrompts[socket.id] = 0;
    io.emit('NEW_USER', socket.id);
    io.emit('COUNT', playerCount);

    socket.on('JOIN_GAME', (data) => {
      let passcode = data.passcode;
      let userObj = data.newuser;
      if(!serverPasscode){serverPasscode = passcode}
      else if (serverPasscode === passcode){
        allPlayers.push(userObj);
        io.emit('ALLPLAYERS', allPlayers)
      }
    })

    // socket.on('NEW_USER', (data) => {
    //   allPlayers[data.userid] = data.username; //saving socketid username pairs
    //   console.log(allPlayers, 'dataa')
    //   // io.emit('RECEIVE_MESSAGE', data);
    //   io.emit('ALLPLAYERS', allPlayers)

    if(playerCount >= 4 && assigned === false){ // idiot figure out a function asap
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
    }



    if(playerCount >= 4 && assigned === false){
      for(let i = 0; i < allPlayers.length; i++) {
        let usageCounter = 0;
        while(usageCounter <= 2){
          console.log('hellllllo', usageCounter)
          usageCounter ++;
          for(var key in userId){
            if(userId[key]['count'] === undefined) {userId[key]['count'] = 0;}
            if(userId[key]['prompts'] === undefined) {userId[key]['prompts'] = [];}
            console.log(key, userId[key], 'count hurrr')
            if(userId[key].count <= 2){
              userId[key].count += 1;
              console.log('key', userId[key]['count'], 'does it show')
              console.log(usageCounter)
              let arr = userId[key]['prompts'];
              arr.push(message[i]);
              userId[key]['prompts'] = arr;
              console.log('yoyyo', userId[key])
            } 
          }
        }
      }
    console.log(userId, 'should show here')
    //   }

    // });
    socket.on('SEND', (data) => {
      console.log(data, 'dataa')
      io.emit('RECEIVE_MESSAGE', data);
    });
    socket.on('disconnect', () => {
      console.log('client disconnect...', socket.id)
      let leftUser = socket.id
      delete userId[leftUser]
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