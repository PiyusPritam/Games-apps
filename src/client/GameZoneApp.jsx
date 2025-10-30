import React, { useState, useEffect } from 'react'
import './GameZoneApp.css'
import GameDashboard from './components/GameDashboard'
import ScoreBoard from './components/ScoreBoard'
import ChessGame from './games/ChessGame'
import WhackAMoleGame from './games/WhackAMoleGame'
import SudokuGame from './games/SudokuGame'
import GameService from './services/GameService'

const GameZoneApp = () => {
    const [currentView, setCurrentView] = useState('dashboard')
    const [selectedGame, setSelectedGame] = useState(null)
    const [userProfile, setUserProfile] = useState({
        name: 'Player',
        level: 1,
        experience: 0,
        totalScore: 0
    })
    const [games, setGames] = useState([])
    const [sessions, setSessions] = useState([])
    const [darkMode, setDarkMode] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [shareData, setShareData] = useState(null)

    // Load data on component mount
    useEffect(() => {
        loadGames()
        loadUserData()
        loadSessions()
        // Load dark mode preference from localStorage
        const savedDarkMode = localStorage.getItem('gameZoneDarkMode') === 'true'
        setDarkMode(savedDarkMode)
    }, [])

    // Apply dark mode class to body
    useEffect(() => {
        document.body.className = darkMode ? 'dark-mode' : 'light-mode'
        localStorage.setItem('gameZoneDarkMode', darkMode.toString())
    }, [darkMode])

    const loadGames = async () => {
        try {
            const gamesData = await GameService.getGames()
            setGames(gamesData)
        } catch (error) {
            console.error('Error loading games:', error)
        }
    }

    const loadUserData = async () => {
        try {
            const userData = await GameService.getUserProfile()
            setUserProfile(userData)
        } catch (error) {
            console.error('Error loading user data:', error)
        }
    }

    const loadSessions = async () => {
        try {
            const sessionsData = await GameService.getUserSessions()
            setSessions(sessionsData)
        } catch (error) {
            console.error('Error loading sessions:', error)
        }
    }

    const handleGameSelect = (game) => {
        setSelectedGame(game)
        setCurrentView('game')
    }

    const handleBackToDashboard = () => {
        setCurrentView('dashboard')
        setSelectedGame(null)
        // Refresh data when returning to dashboard
        loadUserData()
        loadSessions()
    }

    const handleViewScores = () => {
        setCurrentView('scoreboard')
    }

    const handleGameComplete = async (gameData) => {
        try {
            // Save session data
            const session = await GameService.saveGameSession(gameData)
            
            // Update user profile
            await loadUserData()
            
            // Show share modal
            setShareData({
                gameName: gameData.gameName,
                score: gameData.finalScore,
                level: userProfile.level,
                timeSpent: gameData.timeSpent
            })
            setShowShareModal(true)
            
            // Return to dashboard after a delay
            setTimeout(() => {
                handleBackToDashboard()
            }, 2000)
            
        } catch (error) {
            console.error('Error saving game session:', error)
        }
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const shareScore = (platform) => {
        if (!shareData) return

        const message = `🎮 Just scored ${shareData.score} points in ${shareData.gameName} on Game Zone! Level ${shareData.level} 🏆 #GameZone #Gaming`
        const url = window.location.href

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank')
                break
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank')
                break
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`, '_blank')
                break
            case 'copy':
                navigator.clipboard.writeText(`${message} ${url}`).then(() => {
                    alert('Score copied to clipboard!')
                })
                break
            default:
                break
        }
        setShowShareModal(false)
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return (
                    <GameDashboard
                        games={games}
                        userProfile={userProfile}
                        onGameSelect={handleGameSelect}
                        onViewScores={handleViewScores}
                        darkMode={darkMode}
                        onToggleDarkMode={toggleDarkMode}
                    />
                )
            case 'scoreboard':
                return (
                    <ScoreBoard
                        sessions={sessions}
                        userProfile={userProfile}
                        onBack={handleBackToDashboard}
                        darkMode={darkMode}
                    />
                )
            case 'game':
                return renderGameComponent()
            default:
                return null
        }
    }

    const renderGameComponent = () => {
        if (!selectedGame) return null

        const gameProps = {
            game: selectedGame,
            onGameComplete: handleGameComplete,
            onBack: handleBackToDashboard,
            darkMode: darkMode
        }

        switch (selectedGame.name?.toLowerCase()) {
            case 'chess':
                return <ChessGame {...gameProps} />
            case 'whack-a-mole':
                return <WhackAMoleGame {...gameProps} />
            case 'sudoku':
                return <SudokuGame {...gameProps} />
            default:
                return (
                    <div className="game-not-found">
                        <h2>Game not found</h2>
                        <button onClick={handleBackToDashboard} className="back-button">
                            Back to Dashboard
                        </button>
                    </div>
                )
        }
    }

    return (
        <div className={`game-zone-app ${darkMode ? 'dark' : 'light'}`}>
            {renderCurrentView()}
            
            {/* Share Modal */}
            {showShareModal && shareData && (
                <div className="share-modal-overlay">
                    <div className="share-modal">
                        <div className="share-header">
                            <h3>🎉 Great Game!</h3>
                            <button 
                                className="close-button"
                                onClick={() => setShowShareModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="share-content">
                            <p>You scored <strong>{shareData.score}</strong> points in {shareData.gameName}!</p>
                            <p>Share your achievement:</p>
                            <div className="share-buttons">
                                <button 
                                    className="share-btn twitter"
                                    onClick={() => shareScore('twitter')}
                                >
                                    🐦 Twitter
                                </button>
                                <button 
                                    className="share-btn facebook"
                                    onClick={() => shareScore('facebook')}
                                >
                                    📘 Facebook
                                </button>
                                <button 
                                    className="share-btn linkedin"
                                    onClick={() => shareScore('linkedin')}
                                >
                                    💼 LinkedIn
                                </button>
                                <button 
                                    className="share-btn copy"
                                    onClick={() => shareScore('copy')}
                                >
                                    📋 Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GameZoneApp