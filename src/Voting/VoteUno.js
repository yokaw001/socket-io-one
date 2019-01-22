import React from 'react';



const VoteUno = (props) => { // Fix this hardcoding shit bruh
   let assignedPrompts = props.assignedPrompts;
//    let currPlayer = props.currPlayer;
   let allPromptPairs = props.allPromptPairs;
   console.log(props.vote1[1], 'here is that')

    return (
        <div>
            <h3>{props.assignedPrompt}</h3>
            <div>
                <div onClick={console.log(e.target, 'target here')}>{props.vote1[0].prompts[props.assignedPrompt]}</div>
                <div>{props.vote1[1].prompts[props.assignedPrompt]}</div>
            </div>
        </div>
    )
}

export default VoteUno;

