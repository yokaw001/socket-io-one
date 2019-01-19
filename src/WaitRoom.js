import React from 'react';

const WaitRoom = (props) => {
    let characterList = props.characterList;
    return (
        <div>
            <div>Count Down Til Blast Off</div>
            {props.allUsers.map((user, i) => <div><div>{user}</div><img src={characterList[i]} alt="Smiley face" height="42" width="42"/></div>)}
        </div>
    )
}

export default WaitRoom;