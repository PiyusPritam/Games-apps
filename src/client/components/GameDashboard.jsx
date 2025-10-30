import React from 'react'
import './GameDashboard.css'

const GameDashboard = ({ 
    games, 
    userProfile, 
    onGameSelect, 
    onViewScores, 
    darkMode, 
    onToggleDarkMode 
}) => {
    const getGameIcon = (gameName) => {
        switch (gameName?.toLowerCase()) {
            case 'chess': return '♛'
            case 'whack-a-mole': return '🔨'
            case 'sudoku': return '🔢'
            default: return '🎮'
        }
    }

    const getDifficultyColor = (level) => {
        if (level <= 3) return '#48bb78' // Easy - Green
        if (level <= 6) return '#ed8936' // Medium - Orange
        return '#f56565' // Hard - Red
    }

    const formatTime = (seconds) => {
        if (!seconds) return 'No limit'
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}m ${remainingSeconds}s`
    }

    const calculateLevelProgress = () => {
        const currentLevelXP = userProfile.experience % 1000
        return (currentLevelXP / 1000) * 100
    }

    return (
        <div className={`dashboard ${darkMode ? 'dark' : 'light'}`}>
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="main-title">🎮 Game Zone</h1>
                        <p className="subtitle">Challenge yourself with our collection of mini-games!</p>
                    </div>
                    <div className="header-controls">
                        <button 
                            className="control-btn view-scores"
                            onClick={onViewScores}
                        >
                            📊 Leaderboard
                        </button>
                        <button 
                            className="control-btn dark-mode-toggle"
                            onClick={onToggleDarkMode}
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="user-profile-section">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {userProfile.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div className="profile-info">
                            <h3>{userProfile.name || 'Player'}</h3>
                            <p>Level {userProfile.level || 1} Gamer</p>
                        </div>
                        <div className="profile-badge">
                            <span className="badge-text">
                                {userProfile.level >= 10 ? '🏆 Expert' : 
                                 userProfile.level >= 5 ? '🥉 Advanced' : 
                                 '🌟 Beginner'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="profile-stats">
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
                            <div className="stat-value">{Math.floor((userProfile.experience || 0) / 100)}</div>
                            <div className="stat-label">Games Played</div>
                        </div>
                    </div>

                    <div className="level-progress">
                        <div className="progress-info">
                            <span>Progress to Level {(userProfile.level || 1) + 1}</span>
                            <span>{userProfile.experience % 1000}/1000 XP</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${calculateLevelProgress()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="games-section">
                <h2 className="section-title">Available Games</h2>
                
                {games.length === 0 ? (
                    <div className="no-games">
                        <div className="no-games-icon">🎮</div>
                        <h3>No Games Available</h3>
                        <p>Games are being loaded or no games have been created yet.</p>
                        <p>Contact your administrator to add games to the platform.</p>
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map((game, index) => {
                            const gameName = typeof game.name === 'object' ? game.name.display_value : game.name
                            const description = typeof game.description === 'object' ? game.description.display_value : game.description
                            const maxScore = typeof game.max_score === 'object' ? parseInt(game.max_score.display_value) : parseInt(game.max_score)
                            const timeLimit = typeof game.time_limit === 'object' ? parseInt(game.time_limit.display_value) : parseInt(game.time_limit)
                            const difficultyLevel = typeof game.difficulty_level === 'object' ? parseInt(game.difficulty_level.display_value) : parseInt(game.difficulty_level)
                            const rules = typeof game.rules === 'object' ? game.rules.display_value : game.rules

                            return (
                                <div key={game.sys_id || index} className="game-card">
                                    <div className="game-header">
                                        <div className="game-icon">
                                            {getGameIcon(gameName)}
                                        </div>
                                        <div className="game-difficulty">
                                            <div 
                                                className="difficulty-indicator"
                                                style={{
                                                    backgroundColor: getDifficultyColor(difficultyLevel),
                                                    width: `${(difficultyLevel / 10) * 100}%`
                                                }}
                                            ></div>
                                            <span className="difficulty-text">
                                                Level {difficultyLevel}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="game-content">
                                        <h3 className="game-title">{gameName}</h3>
                                        <p className="game-description">{description}</p>
                                        
                                        <div className="game-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">🏆</span>
                                                <span>Max Score: {maxScore?.toLocaleString() || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">⏱️</span>
                                                <span>Time: {formatTime(timeLimit)}</span>
                                            </div>
                                        </div>

                                        <div className="game-rules">
                                            <details>
                                                <summary>📖 Game Rules</summary>
                                                <p>{rules || 'No specific rules provided.'}</p>
                                            </details>
                                        </div>
                                    </div>

                                    <div className="game-actions">
                                        <button 
                                            className="play-button"
                                            onClick={() => onGameSelect({
                                                ...game,
                                                name: gameName,
                                                description,
                                                max_score: maxScore,
                                                time_limit: timeLimit,
                                                difficulty_level: difficultyLevel,
                                                rules
                                            })}
                                        >
                                            🚀 Play Now
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            <div className="tips-section">
                <h3>🎯 Gaming Tips</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">⚡</span>
                        <p>Play regularly to level up faster and unlock achievements!</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🏆</span>
                        <p>Higher difficulty games give more experience points.</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">📊</span>
                        <p>Check the leaderboard to see how you rank against others!</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🎮</span>
                        <p>Follow game rules carefully - violations lead to disqualification.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameDashboard