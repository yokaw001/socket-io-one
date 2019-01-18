import React from 'react';

const Login = (props) => {
    return (
        <div>
            <input type="text" onChange={props.handleInput} id="username" placeholder="Username" className="form-control"/>
            <button type="submit" id ="signedIn" onClick={props.handleSubmit}>Submit</button>
        </div>
    )
}

export default Login;