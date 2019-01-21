import React from 'react';

const Answer = (props) => {
    let obj = props.currPlayer.prompts;
    let ques = [];
    for(let key in obj){
        ques.push(key);
    }
    return (
        <div>
           {ques.map((q, i) => <div><div>{q}</div><input id= {`ques${i+1}`} onChange={(e) => props.handleInput(e)}></input></div>)}
           <button title="Voting" onClick={(e)=>props.handleSubmit(e)}>Submit</button>
        </div>
    )
}

export default Answer;