import React from 'react';



const VoteUno = (props) => { // Fix this hardcoding shit bruh
   let currPlayer = props.currPlayer;
   let first;
   let second;

   if (currPlayer.userid === props.vote1[0].userid || currPlayer.userid === props.vote1[1].userid) {
    first = 'Waiting for Voting';
    second = '';
   } else {
    first = props.vote1[0].prompts[props.assignedPrompt];
    second = props.vote1[1].prompts[props.assignedPrompt];
   }
    return (
        <div>
            <h3>{props.assignedPrompt}</h3>
            <div> // fix this part follow it.... wha tdo i need to track the winner of this round and to keep total score in each user obj
                <div onClick={() => props.handleResults({updated: props.vote1[0], answer: 0, voter: currPlayer})}>{first}</div>
                <div onClick={() => props.handleResults({updated: props.vote1[1], answer: 1, voter: currPlayer})}>{second}</div>
            </div>
        </div>
    )
}

export default VoteUno;

