import React, { useState, useEffect, useCallback, useRef } from 'react';
import './WhackAMoleGame.css';

const MOLE_TYPES = {
  normal: { emoji: '🐭', points: 10, probability: 0.7 },
  golden: { emoji: '✨🐭', points: 50, probability: 0.2 },
  bomb: { emoji: '💣', points: -25, probability: 0.1 }
};

export default function WhackAMoleGame({ game, session, onGameEnd, onReturn }) {
  const [holes, setHoles] = useState(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [level, setLevel] = useState(1);
  const [hitStreak, setHitStreak] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [emptyHoleClicks, setEmptyHoleClicks] = useState(0);

  // Extract time limit safely
  const timeLimitValue = typeof game.time_limit === 'object' ? 
    game.time_limit.display_value : game.time_limit;
  const [timeLeft, setTimeLeft] = useState(parseInt(timeLimitValue) || 120);
  
  const gameIntervalRef = useRef(null);
  const moleTimeoutsRef = useRef([]);
  const lastClickTimeRef = useRef(0);

  const gameRules = typeof game.rules === 'object' ? game.rules.display_value : game.rules;

  useEffect(() => {
    if (gameStatus === 'playing') {
      // Start mole spawning
      startMoleSpawning();
      
      return () => {
        clearInterval(gameIntervalRef.current);
        moleTimeoutsRef.current.forEach(clearTimeout);
      };
    }
  }, [gameStatus, level]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, gameStatus]);

  // Anti-cheat: Check for spam clicking
  useEffect(() => {
    if (emptyHoleClicks >= 10) {
      handleDisqualification('Spam clicking detected - clicking empty holes repeatedly');
    }
  }, [emptyHoleClicks]);

  const startMoleSpawning = () => {
    const baseInterval = Math.max(800 - (level * 50), 300); // Gets faster each level
    
    gameIntervalRef.current = setInterval(() => {
      spawnMole();
    }, baseInterval);
  };

  const spawnMole = () => {
    const emptyHoles = holes.map((hole, index) => hole === null ? index : null).filter(i => i !== null);
    
    if (emptyHoles.length === 0) return;
    
    const randomHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
    const moleType = getMoleType();
    
    setHoles(prevHoles => {
      const newHoles = [...prevHoles];
      newHoles[randomHole] = {
        type: moleType,
        timestamp: Date.now()
      };
      return newHoles;
    });

    // Remove mole after a certain time
    const moleTimeout = setTimeout(() => {
      setHoles(prevHoles => {
        const newHoles = [...prevHoles];
        if (newHoles[randomHole] && newHoles[randomHole].timestamp === Date.now() - (1200 - level * 100)) {
          newHoles[randomHole] = null;
        }
        return newHoles;
      });
    }, Math.max(1200 - (level * 100), 500));

    moleTimeoutsRef.current.push(moleTimeout);
  };

  const getMoleType = () => {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, config] of Object.entries(MOLE_TYPES)) {
      cumulative += config.probability;
      if (rand <= cumulative) return type;
    }
    return 'normal';
  };

  const handleHoleClick = (holeIndex) => {
    if (gameStatus !== 'playing') return;

    const currentTime = Date.now();
    setClicks(clicks + 1);

    // Anti-cheat: Check for rapid clicking (potential bot)
    if (currentTime - lastClickTimeRef.current < 50) {
      handleDisqualification('Automated clicking detected - clicks too fast for human');
      return;
    }
    lastClickTimeRef.current = currentTime;

    const hole = holes[holeIndex];
    
    if (hole === null) {
      // Clicked empty hole
      setEmptyHoleClicks(prev => prev + 1);
      return;
    }

    // Reset empty hole click counter on successful hit
    setEmptyHoleClicks(0);

    const moleType = hole.type;
    const points = MOLE_TYPES[moleType].points;
    
    // Anti-cheat: Prevent multiple clicks on same mole
    setHoles(prevHoles => {
      const newHoles = [...prevHoles];
      newHoles[holeIndex] = null;
      return newHoles;
    });

    const newScore = Math.max(0, score + points);
    setScore(newScore);

    if (points > 0) {
      setHitStreak(hitStreak + 1);
      
      // Level up every 10 successful hits
      if ((hitStreak + 1) % 10 === 0) {
        setLevel(level + 1);
      }
    } else {
      setHitStreak(0);
      if (moleType === 'bomb') {
        // Show bomb explosion effect (could add visual feedback here)
        console.log('Bomb hit! -25 points');
      }
    }
  };

  const handleDisqualification = useCallback((reason) => {
    setGameStatus('disqualified');
    clearInterval(gameIntervalRef.current);
    moleTimeoutsRef.current.forEach(clearTimeout);
    onGameEnd(score, false, reason);
  }, [score, onGameEnd]);

  const handleGameEnd = useCallback(() => {
    setGameStatus('completed');
    clearInterval(gameIntervalRef.current);
    moleTimeoutsRef.current.forEach(clearTimeout);
    
    // Bonus points for good accuracy
    const accuracy = clicks > 0 ? Math.max(0, ((clicks - emptyHoleClicks) / clicks) * 100) : 0;
    const accuracyBonus = Math.floor(accuracy * 2);
    const timeBonus = Math.floor(timeLeft / 2);
    const finalScore = score + accuracyBonus + timeBonus;
    
    onGameEnd(finalScore, finalScore > 0);
  }, [score, clicks, emptyHoleClicks, timeLeft, onGameEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = () => {
    return clicks > 0 ? Math.round(((clicks - emptyHoleClicks) / clicks) * 100) : 0;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">🔨 Whack-a-Mole</h2>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Time: {formatTime(timeLeft)}</span>
          <span>Level: {level}</span>
          <span>Streak: {hitStreak}</span>
          <span>Accuracy: {getAccuracy()}%</span>
        </div>
      </div>

      <div className="whack-game-area">
        <div className="mole-grid">
          {holes.map((hole, index) => (
            <div
              key={index}
              className={`mole-hole ${hole ? 'has-mole' : ''}`}
              onClick={() => handleHoleClick(index)}
            >
              <div className="hole-base"></div>
              {hole && (
                <div className={`mole ${hole.type}`}>
                  {MOLE_TYPES[hole.type].emoji}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="game-legend">
          <div className="legend-item">
            <span className="legend-icon">🐭</span>
            <span>Normal Mole: +10 pts</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">✨🐭</span>
            <span>Golden Mole: +50 pts</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">💣</span>
            <span>Bomb: -25 pts (Avoid!)</span>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button className="btn btn-secondary" onClick={onReturn}>
          Return to Dashboard
        </button>
      </div>

      <div className="rules-section">
        <h3>Whack-a-Mole Rules</h3>
        <div className="rules-content">
          {gameRules && gameRules.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}