import React from 'react';

const Login = (props) => {
    return (
        <div> 
            <div>{props.passcode}</div>
            <input type="text" onChange={props.handleInput} id="passcode" placeholder="passcode" className="form-control"/>
            <input type="text" onChange={props.handleInput} id="username" placeholder="username" className="form-control"/>
            <button type="submit" title="WaitRoom" onClick={props.handleSubmit}>Join Game</button>
        </div>
    )
}

export default Login;