import React from 'react';



const VoteUno = (props) => { // Fix this hardcoding shit bruh
   let currPlayer = props.currPlayer;
   let first;
   let second;
   let prompt = props.assignedPrompt;
   // vote 1 containers filtered players that have current prompt
    // console.log(props.results, 'its finally here')
   if (currPlayer.userid === props.vote1[0].userid || currPlayer.userid === props.vote1[1].userid) {
    first = 'Waiting for Voting';
    second = '';
   } else {
    first = props.vote1[0].prompts[prompt];
    second = props.vote1[1].prompts[prompt];
    // console.log(first, 'first')
   } 
//    if(props.results){
//        console.log(props.results[1], 'is it here')
//    }
   let answerone = props.results[1] ? props.results[1][first] : [];
   let answertwo = props.results[1] ? props.results[1][second] : [];
   // MAKE IT ONLY CLICKABLE 1X...!
    return (
        <div>
            <h3>{props.assignedPrompt}</h3> /
            <div className="answerone"> 
                <ul>{answerone.map(person => <li>{person}</li>)}</ul>
                <div onClick={() => props.handleResults({number: props.number, updated: props.vote1[0], votedfor: {prompt: prompt, answer: props.vote1[0].prompts[prompt]}, voter: currPlayer})}>{first}</div>
            </div>
            <div className="answertwo">
                <ul>{answertwo.map(person => <li>{person}</li>)}</ul>
                <div onClick={() => props.handleResults({number: props.number, updated: props.vote1[1], votedfor: {prompt: prompt, answer: props.vote1[1].prompts[prompt]}, voter: currPlayer})}>{second}</div>
            </div>
        </div>
    )
}

export default VoteUno;

