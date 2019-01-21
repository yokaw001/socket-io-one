import React from 'react';

const WaitRoom = (props) => {
    let playerCount = props.allPlayers.length;
    let playersLeft = 4-playerCount;
    if(playerCount === 4){props.handleViewChange("Game")}
    return (
        <div>
            <div>{playersLeft} Mas Players Til Blast Off</div>
            <ul> Current Playas
                {props.allPlayers.map((user) => <div>{user.username}</div>)}
            </ul>
        </div>
    )
}

export default WaitRoom;