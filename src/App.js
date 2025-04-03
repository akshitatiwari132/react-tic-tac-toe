/*
 App.js

 my file has the entire tictactoe in one component file:
 - main app (manages game state, move history, winner logic)
 - board (3x3 squares)
 - square (represents each cell on the board)
 - calculateWinner helper function
 
 Akshita Tiwari
 4/2/2025
 */


import React, { useState } from 'react';
import './App.css';

// this function important bc has history of moves
// AND whose turn it is
// AND choosing winner/draw

function App() {

  // history is our array - squares is state of all 9 squares, location is column, row of move
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null }
  ]);

  // stepNumber tells us what move we're looking at
  // 0 - start, 1 - after first, etc.
  const [stepNumber, setStepNumber] = useState(0);

  //xIsNext is boolean telling us whose turn it is
  const [xIsNext, setXIsNext] = useState(true);


  // called whenever square clicked
  const handleClick = (i) => {
    // our history is up to the current step
    const historyUpToNow = history.slice(0, stepNumber + 1);
    const current = historyUpToNow[historyUpToNow.length - 1];
    // we make copy of squares so dont change state directly
    const squares = current.squares.slice();

    // IF we have a winner or square filled do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // fill square w x or o 
    squares[i] = xIsNext ? 'X' : 'O';

    // we calc row column of clikced square for display
    const location = { col: (i % 3) + 1, row: Math.floor(i / 3) + 1 };

    // we update history
    setHistory(historyUpToNow.concat([{ squares, location }]));

    // move forward to next step
    setStepNumber(historyUpToNow.length);

    // switch turns
    setXIsNext(!xIsNext);
  };

  // jump to lets us go to a specific move in history
  const jumpTo = (step) => {
    setStepNumber(step);
    // if step even, means x was first, so x goes on even
    setXIsNext(step % 2 === 0);
  };

  // current board state is from history at stepnumber
  const current = history[stepNumber];

  // use this to see if someone won
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;

  // make list of moves to show in sidebar
  const moves = history.map((step, move) => {
    const locationInfo = step.location ? `(${step.location.col}, ${step.location.row})` : '';
    // describe move for button text
    const desc = move ? `Go to move #${move} ${locationInfo}` : 'Go to game start';
    
    // if we on current move highlight button
    return (
      <li key={move}>
        <button 
          className={move === stepNumber ? 'selected-move' : ''}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  // status message for top
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!current.squares.includes(null)) {
    // if no winner and no empty then draw
    status = 'Draw: No Winner';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winningSquares={winnerInfo ? winnerInfo.winningSquares : []}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// now board we havve 9 squares in 3x3
function Board({ squares, onClick, winningSquares }) {
  // our helper function to make each square
  const renderSquare = (i) => {
    const isWinning = winningSquares.includes(i);
    return (
      <Square 
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinning={isWinning}
      />
    );
  };

  // building board row by row
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardCols = [];
    for (let col = 0; col < 3; col++) {
      boardCols.push(renderSquare(row * 3 + col));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardCols}
      </div>
    );
  }
  return <div>{boardRows}</div>;
}


// for each square
function Square({ value, onClick, isWinning }) {
  return (
    <button className={`square ${isWinning ? 'highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle
    [6, 7, 8], // bottom
    [0, 3, 6], // left column
    [1, 4, 7], // middle
    [2, 5, 8], // right
    [0, 4, 8], // diagonal top left to bottom right
    [2, 4, 6] // top right to bottom left
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

export default App;

