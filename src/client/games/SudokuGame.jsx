import React, { useState, useEffect, useCallback } from 'react';
import './SudokuGame.css';

export default function SudokuGame({ game, session, onGameEnd, onReturn }) {
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [currentGrid, setCurrentGrid] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errors, setErrors] = useState(0);

  // Extract time limit safely
  const timeLimitValue = typeof game.time_limit === 'object' ? 
    game.time_limit.display_value : game.time_limit;
  const [timeLeft, setTimeLeft] = useState(parseInt(timeLimitValue) || 900);

  const gameRules = typeof game.rules === 'object' ? game.rules.display_value : game.rules;
  const maxErrors = 3;

  // Sudoku validation utility
  const isValid = (grid, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  };

  const solveSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const fillGrid = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          
          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generatePuzzle = (difficulty) => {
    // Generate a complete solution
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    fillGrid(grid);
    
    const solution = grid.map(row => [...row]);
    
    // Remove numbers based on difficulty
    const cellsToRemove = {
      easy: 35,
      medium: 45,
      hard: 55
    };

    const toRemove = cellsToRemove[difficulty] || cellsToRemove.medium;
    let removed = 0;

    while (removed < toRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (grid[row][col] !== 0) {
        grid[row][col] = 0;
        removed++;
      }
    }

    return {
      puzzle: grid.map(row => [...row]),
      solution: solution
    };
  };

  useEffect(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setCurrentGrid(newPuzzle.map(row => [...row]));
  }, [difficulty]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd('timeout', 'Time limit exceeded');
    }
  }, [timeLeft, gameStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing') return;
    if (puzzle && puzzle[row][col] !== 0) return; // Can't modify pre-filled cells
    
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || gameStatus !== 'playing' || !currentGrid) return;
    
    const [row, col] = selectedCell;
    if (puzzle && puzzle[row][col] !== 0) return;

    const newGrid = currentGrid.map(r => [...r]);
    newGrid[row][col] = number;

    // Check if the move is valid
    if (!isValid(newGrid, row, col, number) && number !== 0) {
      setErrors(errors + 1);
      
      if (errors + 1 >= maxErrors) {
        handleGameEnd('disqualified', 'Too many invalid moves (maximum 3 errors allowed)');
        return;
      }
      
      // Show error but don't place the number
      alert('Invalid move! This number conflicts with Sudoku rules.');
      return;
    }

    setCurrentGrid(newGrid);

    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid)) {
      handleGameEnd('completed', null);
    }
  };

  const isPuzzleComplete = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) return false;
      }
    }
    return true;
  };

  const handleHint = () => {
    if (!selectedCell || gameStatus !== 'playing' || !currentGrid || !solution) return;
    
    const [row, col] = selectedCell;
    if (puzzle && puzzle[row][col] !== 0) return;

    const newGrid = currentGrid.map(r => [...r]);
    newGrid[row][col] = solution[row][col];
    setCurrentGrid(newGrid);
    setHintsUsed(hintsUsed + 1);

    if (isPuzzleComplete(newGrid)) {
      handleGameEnd('completed', null);
    }
  };

  const handleGameEnd = useCallback((result, reason = null) => {
    setGameStatus(result);
    
    let finalScore = 0;
    
    if (result === 'completed') {
      const basePoints = { easy: 500, medium: 1000, hard: 1500 };
      const timeBonus = Math.floor(timeLeft / 5);
      const hintPenalty = hintsUsed * 10;
      
      finalScore = basePoints[difficulty] + timeBonus - hintPenalty;
    }
    
    onGameEnd(finalScore, result === 'completed', reason);
  }, [difficulty, timeLeft, hintsUsed, onGameEnd]);

  const getCellClass = (row, col) => {
    let className = 'sudoku-cell';
    
    if (puzzle && puzzle[row][col] !== 0) className += ' prefilled';
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      className += ' selected';
    }
    if ((row + 1) % 3 === 0 && row < 8) className += ' border-bottom';
    if ((col + 1) % 3 === 0 && col < 8) className += ' border-right';
    
    return className;
  };

  if (!currentGrid) {
    return <div>Loading puzzle...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">🔢 Sudoku</h2>
        <div className="game-stats">
          <span>Time: {formatTime(timeLeft)}</span>
          <span>Difficulty: {difficulty}</span>
          <span>Hints: {hintsUsed}</span>
          <span>Errors: {errors}/{maxErrors}</span>
        </div>
      </div>

      <div className="sudoku-container">
        <div className="sudoku-grid">
          {currentGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="sudoku-controls">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                className="number-btn"
                onClick={() => handleNumberInput(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="number-btn erase-btn"
              onClick={() => handleNumberInput(0)}
            >
              Erase
            </button>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={handleHint}
              disabled={!selectedCell || hintsUsed >= 5}
            >
              Hint (-10 pts)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')}
            >
              Change Difficulty
            </button>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button className="btn btn-secondary" onClick={onReturn}>
          Return to Dashboard
        </button>
      </div>

      <div className="rules-section">
        <h3>Sudoku Rules</h3>
        <div className="rules-content">
          {gameRules && gameRules.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}