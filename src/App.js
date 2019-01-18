import React from 'react';
import Chat from './Chat';
import Login from './Login';
import io from "socket.io-client";


class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            signedIn: false
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        console.log(this.state.username,'username')
        let name = e.target.id;
        this.setState({
            [name]: true
        })
    }
    render() {
        return (
        <div>
            {this.state.signedIn ? <a></a> : <Login handleInput = {this.handleInput} handleSubmit={this.handleSubmit}/>}
            <Chat username={this.state.username} />
        </div>
        );
    }
}

export default App;