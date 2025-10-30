import React, { useState, useEffect } from 'react';
import GameService from '../services/GameService.js';

export default function ScoreBoard({ sessions, userProfile, onBack, darkMode }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // Since we don't have a specific leaderboard endpoint, 
      // we'll create a simple leaderboard from session data
      setLeaderboard([]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#48bb78';
      case 'disqualified': return '#f56565';
      case 'failed': return '#ed8936';
      default: return '#667eea';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '🏆';
      case 'disqualified': return '❌';
      case 'failed': return '⚠️';
      default: return '🎮';
    }
  };

  return (
    <div className={`scoreboard ${darkMode ? 'dark' : 'light'}`}>
      <div className="scoreboard-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1>📊 Your Gaming Statistics</h1>
      </div>

      {/* User Profile Summary */}
      <div className="profile-summary">
        <div className="profile-card">
          <div className="profile-avatar">
            {userProfile.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="profile-info">
            <h2>{userProfile.name || 'Player'}</h2>
            <p>Level {userProfile.level || 1} Gamer</p>
          </div>
          <div className="profile-stats-grid">
            <div className="stat-item">
              <div className="stat-value">{userProfile.totalScore || 0}</div>
              <div className="stat-label">Total Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.level || 1}</div>
              <div className="stat-label">Level</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.experience || 0}</div>
              <div className="stat-label">Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{sessions.length}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="sessions-section">
        <h2>🎮 Recent Game Sessions</h2>
        
        {sessions.length === 0 ? (
          <div className="no-sessions">
            <div className="no-sessions-icon">🎮</div>
            <h3>No Game Sessions Yet</h3>
            <p>Start playing games to see your session history here!</p>
            <button className="play-button" onClick={onBack}>
              Play Your First Game
            </button>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session, index) => {
              const gameName = typeof session.game === 'object' ? 
                session.game.display_value : session.game;
              const score = typeof session.final_score === 'object' ? 
                session.final_score.display_value : session.final_score;
              const status = typeof session.status === 'object' ? 
                session.status.display_value : session.status;
              const startTime = typeof session.start_time === 'object' ? 
                session.start_time.display_value : session.start_time;
              const timeSpent = typeof session.time_spent === 'object' ? 
                session.time_spent.display_value : session.time_spent;

              return (
                <div key={session.sys_id || index} className="session-card">
                  <div className="session-header">
                    <div className="session-game">
                      <span className="session-icon">{getStatusIcon(status)}</span>
                      <span className="game-name">{gameName || 'Unknown Game'}</span>
                    </div>
                    <div 
                      className="session-status"
                      style={{ color: getStatusColor(status) }}
                    >
                      {status || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="session-details">
                    <div className="detail-row">
                      <span className="detail-label">Score:</span>
                      <span className="detail-value">{parseInt(score || 0).toLocaleString()} pts</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time Played:</span>
                      <span className="detail-value">
                        {timeSpent ? `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s` : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(startTime)}</span>
                    </div>
                  </div>
                  
                  <div className="session-footer">
                    <button 
                      className="share-button"
                      onClick={() => {
                        const message = `🎮 Just scored ${parseInt(score || 0).toLocaleString()} points in ${gameName} on Game Zone! 🏆`;
                        navigator.clipboard.writeText(`${message} ${window.location.href}`);
                        alert('Score copied to clipboard!');
                      }}
                    >
                      📤 Share Score
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .scoreboard {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .scoreboard-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .scoreboard-header h1 {
          margin: 0;
          font-size: 2rem;
          color: var(--text-primary);
        }

        .profile-summary {
          margin-bottom: 3rem;
        }

        .profile-card {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          padding: 2rem;
          box-shadow: var(--box-shadow);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          font-weight: bold;
        }

        .profile-info {
          flex: 1;
          min-width: 200px;
        }

        .profile-info h2 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--text-primary);
        }

        .profile-info p {
          margin: 0.5rem 0 0 0;
          color: var(--text-secondary);
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1rem;
          min-width: 400px;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          display: block;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .sessions-section h2 {
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .no-sessions {
          text-align: center;
          background: var(--bg-primary);
          padding: 3rem 2rem;
          border-radius: var(--border-radius);
          border: 2px dashed var(--border-color);
        }

        .no-sessions-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-sessions h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .no-sessions p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .play-button {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: bold;
          transition: var(--transition);
        }

        .play-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .session-card {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--box-shadow);
          border: 1px solid var(--border-color);
          transition: var(--transition);
        }

        .session-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .session-game {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .session-icon {
          font-size: 1.2rem;
        }

        .game-name {
          font-weight: bold;
          color: var(--text-primary);
        }

        .session-status {
          font-weight: bold;
          text-transform: capitalize;
        }

        .session-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          color: var(--text-secondary);
        }

        .detail-value {
          font-weight: bold;
          color: var(--text-primary);
        }

        .session-footer {
          display: flex;
          justify-content: flex-end;
        }

        .share-button {
          background: var(--success-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: bold;
          transition: var(--transition);
        }

        .share-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        @media (max-width: 768px) {
          .scoreboard {
            padding: 1rem;
          }

          .scoreboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .profile-card {
            flex-direction: column;
            text-align: center;
          }

          .profile-stats-grid {
            min-width: auto;
            grid-template-columns: repeat(2, 1fr);
          }

          .sessions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}