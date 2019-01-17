import React from 'react';
import io from "socket.io-client";


class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: []
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
    sendMessage = (e) => {
        e.preventDefault();
        this.socket.emit('SEND', {
            author: this.state.username,
            message: this.state.message
        });
        this.setState({
            username: '',
            message: ''
        });
        e.target.reset();
    }
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Global Chat</div>
                                <hr/>
                                <div className="messages">
                                {this.state.messages.map(message => {
                                    return (
                                        <div>{message.author}: {message.message}</div>
                                    )
                                })} 
                                </div>
                            </div>
                            <div className="card-footer">
                                    <input type="text" onChange={this.handleInput} id="username" placeholder="Username" className="form-control"/>
                                    <br/>
                                    <input type="text" onChange={this.handleInput} id="message" placeholder="Message" className="form-control"/>
                                    <br/>
                                    <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
