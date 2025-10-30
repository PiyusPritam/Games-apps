import React, { useState } from 'react';
import './ChessGame.css';

const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const PIECE_SYMBOLS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

export default function ChessGame({ game, onReturn }) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [moveHistory, setMoveHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  console.log('ChessGame rendered with game:', game);

  const handleSquareClick = (row, col) => {
    console.log('Square clicked:', row, col);
    
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (fromRow === row && fromCol === col) {
        setSelectedSquare(null);
        return;
      }

      // Simple move - just move the piece for now
      const newBoard = board.map(rowArray => [...rowArray]);
      const piece = newBoard[fromRow][fromCol];
      
      if (piece) {
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setMoveCount(moveCount + 1);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        
        const moveNotation = `${piece}${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + col)}${8 - row}`;
        setMoveHistory([...moveHistory, moveNotation]);
      }
      
      setSelectedSquare(null);
    } else {
      const piece = board[row][col];
      if (piece) {
        setSelectedSquare([row, col]);
      }
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">♛ Chess</h2>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Moves: {moveCount}</span>
          <span>Turn: {currentPlayer === 'white' ? '♔ White' : '♚ Black'}</span>
        </div>
      </div>

      <div className="chess-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="chess-row">
            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`chess-square ${
                  (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
                } ${
                  selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex 
                    ? 'selected' : ''
                }`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <span className="chess-piece">{PIECE_SYMBOLS[piece]}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="move-history">
        <h4>Move History:</h4>
        <div className="moves">
          {moveHistory.slice(-6).map((move, index) => (
            <span key={index} className="move">{move}</span>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button className="btn btn-secondary" onClick={onReturn}>
          Return to Dashboard
        </button>
      </div>

      <div className="rules-section">
        <h3>Chess Rules</h3>
        <div className="rules-content">
          <p>This is a simplified chess game. Click a piece to select it, then click another square to move it.</p>
          <p>White pieces are represented by outlined symbols, black pieces by filled symbols.</p>
          <p>Take turns moving pieces. This version focuses on basic movement without advanced rules.</p>
        </div>
      </div>
    </div>
  );
}