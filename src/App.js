import React from 'react';
import Chat from './Chat';
import Login from './Login';
import WaitRoom from './WaitRoom';
import Answer from './Answer';
import VoteUno from './Voting/VoteUno';
import VoteDos from './Voting/VoteDos';
import VoteTres from './Voting/VoteTres';
import VoteQuat from './Voting/VoteQuat';

import io from "socket.io-client";
const socket = io('localhost:9000');



class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            passcode: '',
            userid:'',
            allPlayers: [],
            assignedPrompts: [],
            allPromptPairs:[],
            ques1: '',
            ques2: '',
            vote1: '',
            vote2: '',
            vote3: '',
            vote4: '',
            currView: "Login",
            currPlayer: '',
            time: {},
            seconds: 30,
            votedPrompt1: {},
            results: {},
            // characterList: ["../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png"]
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleResults = this.handleResults.bind(this);
        socket.on('ALLPLAYERS', (data) => { 
            this.setState({
                allPlayers: data
            });
        });
        socket.on('ASSIGNED_PROMPTS', (data) => { 
            this.setState({
                assignedPrompts: data
            });
        });
        socket.on('UPDATED_ALLPLAYERS', (data) => {
            this.setState({
                allPlayers: data
            });
            let answerQuesPair = this.state.allPlayers.map(player => player.prompts);
            this.setState({
                allPromptPairs : answerQuesPair
            });
            for( let i = 0; i < this.state.assignedPrompts.length; i++ ) { 
                let statename = 'vote' + (i+1);
                let filtered = this.state.allPlayers.filter(player => player.prompts[this.state.assignedPrompts[i]]);
                this.setState({
                    [statename] : filtered
                });
            }
        });
        socket.on('CURR_PLAYER', (data) => {
            this.setState({
                currPlayer: data
            });
        });
        socket.on('PASSCODE', (data) => {
            this.setState({
                passcode: data
            });
        });
        socket.on('DENIED_ACCESS', (data)=>{
            alert(data.error);
        });
        socket.on('NEW_USER', (data) => {
            if(this.state.userid === ''){
                this.setState({
                    userid: data
                });
            } 
        });  
        socket.on('RESULTS_VOTE', (data) => {
            this.setState({
                results: data,
            })
            console.log(data, 'data results vote')
        })
    }
    componentDidMount() {
        this.setState({ time: this.state.seconds });
      }
    
    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }
    
    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: seconds,
            seconds: seconds,
        });
        
        if (seconds == 0 && this.state.currView === "Answer") { 
            clearInterval(this.timer);
            this.setState({
                currView: "VoteUno"
            })
        }
        if (seconds == 0 && this.state.currView === "VoteUno") { 
            clearInterval(this.timer);
            // show results 
            // set time out then setstate to next page
            // this.setState({
            //     currView: "VoteDos"
            // })
        }
    }
    handleResults(voted) { // figure this shit out HERRRRE
        let userdata = voted.updated;
        let votedfor = voted.votedfor; // obj with prompt and answer pair as obj
        let voter = voted.voter;
        let number = voted.number;
        // console.log('voted', voted)
        // console.log('votedfor', votedfor)
        socket.emit('RESULT', {
            'number': number,
            'userdatafortally': userdata,
            'votedfor': votedfor,
            'voter': voter
        });
    }

    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        });
    }
    handleSubmit = (e) => {
        let changeView = e.target.title;
        if(changeView){
            this.setState({
                currView: changeView
            });
        }
        let newuser = {userid: this.state.userid, username: this.state.username, points: 0, prompts: {}};
       if(changeView === 'WaitRoom'){
           socket.emit('JOIN_GAME', {
               passcode: this.state.passcode,
               newuser: newuser
           });
       }
        if(this.state.ques1 && this.state.ques2){ // bug updating obj for each
            let currPlayer = this.state.currPlayer;
            let promptsObj = currPlayer.prompts;
            let prompts =[];
            for(let key in promptsObj){
                prompts.push(key);
            }
            currPlayer.prompts[prompts[0]] = this.state.ques1;
            currPlayer.prompts[prompts[1]] = this.state.ques2;
            socket.emit('UPDATED_PLAYER', currPlayer);
        }
    }

    handleViewChange = (e) => {
        let nextView = e.target ? e.target.title : e;
        this.setState({
            currView: nextView
        });
    }
    render() {
        let currView = this.state.currView;
    
        return (
        <div>
            {currView !== "Login" ? <a></a> : <Login passcode={this.state.passcode} handleInput = {this.handleInput} handleViewChange={this.handleViewChange} handleSubmit={this.handleSubmit}/>}
            {currView !== "WaitRoom" ? <a></a> : <WaitRoom allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "Answer" ? <a></a> : <Answer startTimer = {this.startTimer} seconds={this.state.time} handleInput={this.handleInput} handleSubmit={this.handleSubmit} currPlayer = {this.state.currPlayer} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteUno" ? <a></a> : <VoteUno results = {this.state.results} handleResults = {this.handleResults} number = {1} currPlayer = {this.state.currPlayer} vote1 = {this.state.vote1} startTimer = {this.startTimer} seconds={this.state.time} assignedPrompt = {this.state.assignedPrompts[0]} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteDos" ? <a></a> : <VoteDos vote2 = {this.state.vote2} assignedPrompt = {this.state.assignedPrompts[1]} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteTres" ? <a></a> : <VoteTres vote3 = {this.state.vote3} assignedPrompt = {this.state.assignedPrompts[2]} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteQuat" ? <a></a> : <VoteQuat vote4 = {this.state.vote4} assignedPrompt = {this.state.assignedPrompts[3]} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {/* {currView !== "Results" ? <a></a> : <Results handleViewChange={this.handleViewChange}/>} */}
        </div>
        );
    }
}

export default App;