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
let updateCount = 0;
let allPrompts = ['One word to describe yourself', 'Most epic sandwich name', 'Worst Starbucks drink', 'Best excuse to missing work', 'your darkest moment', 'best food', 'best cartoon name', 'grandmas secret'];


io = socket(server);
io.on('connection', (socket) => {
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
            let randomPrompt = Math.floor(Math.random() * (allPrompts.length));
            allPlayers[0].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[1].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length));
            allPlayers[2].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[3].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length));
            allPlayers[0].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[2].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            randomPrompt = Math.floor(Math.random() * (allPrompts.length));
            allPlayers[1].prompts[allPrompts[randomPrompt]] = 'answer';
            allPlayers[3].prompts[allPrompts[randomPrompt]] = 'answer';
            assignedPrompts.push(allPrompts[randomPrompt]);
            allPrompts.splice(randomPrompt, 1)
            assigned = true;
            for(let i = 0; i < allPlayers.length; i++){
              io.to(allPlayers[i].userid).emit('CURR_PLAYER', allPlayers[i]);
            }
            io.emit('ALLPLAYERS', allPlayers);
            io.emit('ASSIGNED_PROMPTS', assignedPrompts);

        }
    });
    socket.on('UPDATED_PLAYER', (data)=>{
      let userid = data.userid; // id of updated player from individual app
      updateCount += 1;
      for(let i = 0; i < allPlayers.length; i++){
        if(allPlayers[i].userid === userid){
          allPlayers.splice(i, 1, data);
        }
      }
      if(updateCount === 4){
        io.emit('UPDATED_ALLPLAYERS', allPlayers)
      }
    });
    socket.on('SEND', (data) => {
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
    })
});