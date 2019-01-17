import React from 'react';

const Login = (props) => {
    return (
        <div>
            <input type="text" onChange={props.handleInput} id="username" placeholder="Username" className="form-control"/>
        </div>
    )
}