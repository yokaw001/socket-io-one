import React from 'react';
import Chat from './Chat';
import Login from './Login';
import WaitRoom from './WaitRoom';
import Answer from './Answer';
// import Voting from './Voting/Voting';
import VoteUno from './Voting/VoteUno';
import VoteDos from './Voting/VoteDos';
import VoteTres from './Voting/VoteTres';
import VoteQuat from './Voting/VoteQuat';

import io from "socket.io-client";
const socket = io('localhost:3000');



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
            currView: "Login",
            currPlayer: ''
            // characterList: ["../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png"]
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        socket.on('ALLPLAYERS', (data) => { 
            console.log('allplayers bug?', data)
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
            console.log('thisallplayers', this.state.allPlayers)
            let answerQuesPair = this.state.allPlayers.map(player => player.prompts);
            console.log('its littttt', answerQuesPair)
            this.setState({
                allPromptPairs : answerQuesPair
            })
        });
        socket.on('CURR_PLAYER', (data) => {
            this.setState({
                currPlayer: data
            }, ()=>console.log(data, 'currplayer here cuhhh'));
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
        // for( let i = 0; i < this.state.assignedPrompts.length; i++ ){
        //     for( let key in )
        // }
    }

    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        let changeView = e.target.title;
        this.setState({
            currView: changeView
        })
        let newuser = {userid: this.state.userid, username: this.state.username, points: 0, prompts: {}};
        socket.emit('JOIN_GAME', {
            passcode: this.state.passcode,
            newuser: newuser
        })
        if(this.state.ques1 && this.state.ques2){ // bug updating obj for each
            let currPlayer = this.state.currPlayer;
            let promptsObj = currPlayer.prompts;
            let prompts =[];
            for(let key in promptsObj){
                prompts.push(key);
            }
            currPlayer.prompts[prompts[0]] = this.state.ques1;
            currPlayer.prompts[prompts[1]] = this.state.ques2;
            socket.emit('UPDATED_PLAYER', currPlayer)
        }
    }
    handleVote = () => {

    }
    handleViewChange = (e) => {
        let nextView = e.target ? e.target.title : e;
        this.setState({
            currView: nextView
        })
    }
    render() {
        let currView = this.state.currView;
        console.log('ques1', this.state.ques1, 'ques2', this.state.ques2)
        return (
        <div>
            {currView !== "Login" ? <a></a> : <Login passcode={this.state.passcode} handleInput = {this.handleInput} handleViewChange={this.handleViewChange} handleSubmit={this.handleSubmit}/>}
            {currView !== "WaitRoom" ? <a></a> : <WaitRoom allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "Answer" ? <a></a> : <Answer handleInput={this.handleInput} handleSubmit={this.handleSubmit} currPlayer = {this.state.currPlayer} handleViewChange={this.handleViewChange}/>}
            {/* {currView !== "Voting" ? <a></a> : <Voting currPlayer = {this.state.currPlayer} assignedPrompts = {this.state.assignedPrompts} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>} */}
            {currView !== "VoteUno" ? <a></a> : <VoteUno currPlayer = {this.state.currPlayer} assignedPrompts = {this.state.assignedPrompts} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteDos" ? <a></a> : <VoteDos currPlayer = {this.state.currPlayer} assignedPrompts = {this.state.assignedPrompts} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteTres" ? <a></a> : <VoteTres currPlayer = {this.state.currPlayer} assignedPrompts = {this.state.assignedPrompts} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
            {currView !== "VoteQuat" ? <a></a> : <VoteQuat currPlayer = {this.state.currPlayer} assignedPrompts = {this.state.assignedPrompts} allPlayers = {this.state.allPlayers} handleViewChange={this.handleViewChange}/>}
        </div>
        );
    }
}

export default App;