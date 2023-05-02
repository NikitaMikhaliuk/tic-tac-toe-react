import { useState } from 'react';

function Square({ value, onSquareClick, isWinSquare }) {
  return (
    <button className={`square ${isWinSquare ? 'square--win': ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, j) {
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    const nextSquares = squares.map(row => row.slice());
    if (xIsNext) {
      nextSquares[i][j] = 'X';
    } else {
      nextSquares[i][j] = 'O';
    }
    onPlay(nextSquares, i, j);
  }

  const winInfo = calculateWinner(squares);
  const [winner, winSquares] = winInfo || [];
  let status;
  if (winner) {
    status = 'Result: winner is ' + winner;
  } else if(squares.every(row => row.every(square => square))) {
    status = 'Result: draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  return (
    <>
      <div className="status">{status}</div>
      {squares.map((row, i) => {
            return (
                <div key={i} className="board-row">
                  {row.map((square, j) => {
                    const isWinSquare = winSquares && winSquares.find(([a,b]) => a === i && b === j);
                    return (
                        <Square key={`${i}${j}`} value={square} isWinSquare={isWinSquare} onSquareClick={() => handleClick(i, j)} />
                    )
                  })}
                </div>
            )
        })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{
    squares: Array(3).fill(Array(3).fill(null)),
    move: null
  }]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [ isOrderAsc, setIsOrderAsc ] = useState(true);
  const xIsNext = currentTurn % 2 === 0;
  const currentSquares = history[currentTurn].squares;

  function handlePlay(nextSquares, i, j) {
    const nextHistory = [...history.slice(0, currentTurn + 1), {
        squares: nextSquares,
        move: [i, j]
    }]
    setHistory(nextHistory);
    setCurrentTurn(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentTurn(nextMove);
  }

  function handleToggle() {
    setIsOrderAsc(!isOrderAsc)
  }

  const moves = history.map(({move}, turn) => {

    let result;
    if (turn === currentTurn) {
        result = (
            <span>You are at turn #{turn}</span>
        );
    } else {
        let description;
        if (turn > 0) {
          description = 'Go to turn #' + turn;
        } else {
          description = 'Go to game start';
        }
        result = (
            <button onClick={() => jumpTo(turn)}>{description}</button>
        );
    }  

    return (
        <li key={turn}>
            {result}
            <span> {move ? `[${move.toString()}]`: ''}</span>
        </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => handleToggle()}>Toggle Moves Order</button>
        <ol>{isOrderAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === squares[b[0]][b[1]] && squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return [squares[a[0]][a[1]], lines[i]];
    }
  }
  return null;
}
