import React from 'react';
import io from "socket.io-client";


class Draw extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };
        this.socket = io('localhost:3000');
        this.sendMessage = this.sendMessage.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });     
        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };
    }
    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        })
    }

    render(){
        return (
            <div className="container">
               
            </div>
        );
    }
}

export default Chat;
