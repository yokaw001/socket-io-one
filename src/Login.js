import React from 'react';

const Login = (props) => {
    return (
        <div> 
            <div>{props.passcode}</div>
            <input type="text" onChange={(e) => props.handleInput(e)} id="passcode" placeholder="passcode" className="form-control"/>
            <input type="text" onChange={(e) => props.handleInput(e)} id="username" placeholder="username" className="form-control"/>
            <button type="submit" title="WaitRoom" onClick={(e) => props.handleSubmit(e)}>Join Game</button>
        </div>
    )
}

export default Login;