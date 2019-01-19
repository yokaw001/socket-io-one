import React from 'react';
import Chat from './Chat';
import Login from './Login';
import WaitRoom from './WaitRoom'
import io from "socket.io-client";
const socket = io('localhost:3000');



class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            userid:'',
            signedIn: false,
            allUsers: [],
            currView: "Login",
            characterList: ["../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png", "../characters/logo-character.png"]
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        socket.on('NEW_USER', (data) => {
            if(this.state.userid === ''){
                console.log('here is here', data)
                this.setState({
                    userid: data
                });
            } 
        });     
    }
    componentDidMount(){

    }
    componentWillUnmount(){
       
    }
    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        socket.on('ALLPLAYERS', (data) => { 
            this.setState({
                allUsers: data
            })
            console.log(this.state.allUsers,'all users')
        })
        let newuser = {userid: this.state.userid, username: this.state.username}
                console.log('reached here')
                socket.emit('NEW_USER', newuser)
    }
    handleViewChange = (e) => {
        let nextView = e.target.title;
        this.setState({
            currView: nextView
        })
    }
    render() {
        let currView = this.state.currView;
        return (
        <div>
            {currView !== "Login" ? <a></a> : <Login handleInput = {this.handleInput} handleViewChange={this.handleViewChange} handleSubmit={this.handleSubmit}/>}
            {currView !== "WaitRoom" ? <a></a> : <WaitRoom characterList={this.state.characterList} allUsers={this.state.allUsers} handleViewChange={this.handleViewChange}/>}
            <Chat username={this.state.username} socket={socket}/>
        </div>
        );
    }
}

export default App;