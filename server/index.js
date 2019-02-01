const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

server = app.listen(9000, function(){
    console.log('server is running on port 9000')
});
app.use(express.static(path.join(__dirname, '../client/dist')));

let serverPasscode;
let allPlayers = []; 
let playerCount;
let assignedPrompts = [];
let assigned = false;
let updateCount = 0;
let results = {};
let voteTally = {};
let voteSendCheck = 0;

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
    });
    socket.on('RESULT', (data) => {
      let userdata = data.userdatafortally; 
      let votedfor = data.votedfor; 
      let number = data.number;
      // console.log('votedfor', votedfor)
      // let votedPrompt = votedfor.prompt;
      let votedAnswer = votedfor.answer;
      let voterName = data.voter.username;

      // is there an obj at vote number? if so is there a key for that answer?
      // if no key for voted on answer create key and add voteName as array for value
      // if there is a key with array as value then just push the votername into array

      if(!voteTally[number]){
        voteTally[number] = {};
        voteTally[number][votedAnswer] = [voterName];
      } else if (!voteTally[number][votedAnswer]) {
        voteTally[number][votedAnswer] = [voterName];
      } else {
        voteTally[number][votedAnswer].push(voterName);
      }

      voteSendCheck++; // check if all votes came in before emit
      if(voteSendCheck === 2){
        console.log(voteSendCheck, 'check the numbaa')
        io.emit('RESULTS_VOTE', voteTally);
        voteSendCheck = 0;  // reset vote counter and records
      }
      console.log('votetally is currently lookin like', voteTally)
      
      // console.log('does this match', votedPrompt, votedAnswer, voterName)
        // io.emit('RESULTS_VOTE', {votedPrompt: votedPrompt, votedAnswer: votedAnswer, voterName: voterName})      
        for(let i = 0; i < allPlayers.length; i++){
          if(allPlayers[i].userid === userdata.userid){
            // console.log(allPlayers[i], 'points before update')
            allPlayers[i].points = allPlayers[i].points += 1;
            // console.log(allPlayers[i], 'points should be updated')
          }
        }

      // results[prompt] ? results[prompt] = results[prompt].push(voter) : results[prompt] = [voter];

      // for ( let i = 0; i < allPlayers.length; i++ ){
      //   if(userdata.userid === allPlayers[i].userid){
      //     allPlayers[i].prompts = allPlayers[i].prompts += 1;
      //   }
      // }
    })
});