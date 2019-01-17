import React from 'react';
import Chat from './Chat';

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            
        };

    }
    handleInput = (e) => {
        let name = e.target.id;
        this.setState({
            [name]: e.target.value
        })
    }
    render() {
        return (
        <div>
            <Login />
            <Chat/>
        </div>
        );
    }
}

export default App;