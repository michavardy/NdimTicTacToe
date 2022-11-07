import React from 'react'
import { useState, createContext, useReducer, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import "./Render.css";


//TODO 
// write updatePlayers function that takes symbols and newNumPlayers and outputs players list
// write in conseq Turns logic
// format ctrl inputs nicely

const initialState = {
    board:[[null, null, null],[null, null, null],[null, null, null]],
    dimension:3,
    symbols:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
    numPlayers:2,
    conseqTurnsPerSeq:1,
    currTurnPerSeq:1,
    players:['x','o'],
    curPlayer:'x',
    turnNumber:0
};



export default function RenderGame() {
    const [state,dispatch] = useReducer(reducer, initialState);
    const idRef = useRef(0)
    useEffect(()=>{console.log(state)},[state]);
    
    return (
      <div className="screen">
        <div className="board">
            {state.board.map((row,row_index)=>(
                <div className="row">
                    {row.map((column, column_index)=>(
                        <button
                            className="cell"
                            type="text"
                            id={"row"+row_index+1 + "_column"+ column_index+1}
                            onClick={() => dispatch({type:"play",payload:{position:[row_index,column_index]}})}
                            >
                            {state.board[row_index][column_index]}
                        </button>
                    ))}
                </div>
            ))}
        </div>
        <div className="ctrls">
            <button className="ctrl_button" onClick={() => dispatch({type:"reset",payload:{}})}>reset</button>
            <button className="ctrl_button" onClick={() => dispatch({type:"skip",payload:{}})}>skip</button>
            <label className="ctrl_button">number of players</label>
            <input className="ctrl_button" onChange={(e)=>dispatch({type:"updatePlayers",payload:{newNumPlayers:Number(e.nativeEvent.data)}})}></input>
            <label className="ctrl_button">dimensions</label>
            <input className="ctrl_button" onChange={(e)=>dispatch({type:"dimensions",payload:{dimension:Number(e.nativeEvent.data)}})}></input>
            <label className="ctrl_button">consequitive moves per turn</label>
            <input className="ctrl_button" onChange={(e)=>dispatch({type:"conseqTurns",payload:{conseqTurn:Number(e.nativeEvent.data)}})}></input>
        </div>
      </div>
  )};

function updateBoard(player, pos, currBoard){
    let newBoard = currBoard.map(sub => [...sub])
    newBoard[pos[0]][pos[1]] = player
    return newBoard
}

function togglePlayer(curPlayer, playerList){
    let index = playerList.findIndex(p => {return p == curPlayer})
    if (index === playerList.length - 1) {
        return playerList[0]
    }
    else{
        return playerList[index + 1]
    }
}

function updatePlayers(newNumPlayers,state){
    let newPlayerArray = [...Array(newNumPlayers).keys()].map(()=>{return state.symbols[Math.floor(Math.random()*state.symbols.length)]})
    return newPlayerArray
}

function calcTurnPerSequence(state){
    if (state.currTurnPerSeq  === state.conseqTurnsPerSeq){
        let newTurnPerSeq = 1
        let currPlayer = togglePlayer(state.curPlayer, state.players)
        return [newTurnPerSeq,currPlayer]
    }
    else{
        let newTurnPerSeq = state.currTurnPerSeq + 1
        let currPlayer = state.curPlayer
        return [newTurnPerSeq,currPlayer]
    }
    
}

function reducer (state,action){
    console.log(`reducer called: action: ${action.type}, payload: ${action.payload}`)
    switch(action.type){
        case "reset":
            return initialState;
        case "play":
            [CurrTurn, CurrPlayer] = calcTurnPerSequence(state)
            return {...state, 
                board:updateBoard(state.curPlayer, action.payload.position, state.board),
                currTurnPerSeq:CurrTurn,
                currPlayer:CurrPlayer,
                turnNumber:state.turnNumber + 1}
        case "skip":
            return {...state, curPlayer:togglePlayer(state.curPlayer, state.players)}
        case "dimensions":
            return {...state,
                board:[...Array(action.payload.dimension).keys()].map((j)=>{return ([...Array(action.payload.dimension).keys()].map((i)=>{return null}))}),
                dimension:action.payload.dimension,
                currPlayer:state.players[0],
                turnNumber:0}
        case "updatePlayers":
            let newPlayers = updatePlayers(action.payload.newNumPlayers,state)
            return {... state,
                board: initialState.board,
                numPlayers:action.payload.newNumPlayers,
                players:newPlayers,
                curPlayer:newPlayers[0],
                turnNumber:0}
        case "conseqTurns":
            return {... state,
                board: initialState.board,
                conseqTurnsPerSeq:action.payload.conseqTurn,
                currPlayer:state.players[0],
                turnNumber:0}
        default:
            console.log(`reducer function called with action: ${action.type}`)
    }
};
  
