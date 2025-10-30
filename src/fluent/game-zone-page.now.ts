import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

export const enhanced_game_zone = UiPage({
  $id: Now.ID['enhanced-game-zone'],
  endpoint: 'x_1599224_game_zon_game_zone.do',
  description: 'Game Zone - Enhanced Gaming Platform with Dark Mode and Score Sharing',
  category: 'general',
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 Game Zone - Enhanced Gaming Platform</title>
    <style>
        /* Base Styles */
        * { box-sizing: border-box; }
        
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          transition: all 0.3s ease;
          min-height: 100vh;
        }

        /* LIGHT MODE (DEFAULT) */
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #2d3748;
        }

        /* DARK MODE */
        body.dark-mode {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
          color: #f7fafc;
        }

        .header {
          background: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        body.dark-mode .header {
          background: #1a202c;
          color: #f7fafc;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin: 0;
        }

        .controls {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5a67d8;
          transform: translateY(-2px);
        }

        .btn-toggle {
          background: #edf2f7;
          color: #2d3748;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          position: relative;
        }

        body.dark-mode .btn-toggle {
          background: #4a5568;
          color: #f7fafc;
        }

        .btn-toggle:hover {
          background: #667eea;
          color: white;
        }

        .content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        body.dark-mode .card {
          background: #1a202c;
          color: #f7fafc;
        }

        .status {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #48bb78;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Error Log Panel */
        .error-panel {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: white;
          border-left: 2px solid #e2e8f0;
          box-shadow: -4px 0 8px rgba(0,0,0,0.1);
          z-index: 1001;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .error-panel.open {
          right: 0;
        }

        body.dark-mode .error-panel {
          background: #1a202c;
          border-color: #4a5568;
          color: #f7fafc;
        }

        .error-header {
          background: #f56565;
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .error-close:hover {
          background: rgba(255,255,255,0.1);
        }

        .error-controls {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          gap: 0.5rem;
        }

        body.dark-mode .error-controls {
          border-color: #4a5568;
        }

        .error-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .error-btn.clear {
          background: #f56565;
        }

        .error-list {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .error-item {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          font-family: monospace;
          font-size: 0.85rem;
        }

        body.dark-mode .error-item {
          border-color: #4a5568;
        }

        .error-item.error {
          background: #fed7d7;
          border-left: 4px solid #f56565;
        }

        .error-item.warning {
          background: #fef5e7;
          border-left: 4px solid #ed8936;
        }

        .error-item.info {
          background: #bee3f8;
          border-left: 4px solid #4299e1;
        }

        .error-item.success {
          background: #c6f6d5;
          border-left: 4px solid #48bb78;
        }

        body.dark-mode .error-item.error {
          background: #2d3748;
          color: #fed7d7;
        }

        body.dark-mode .error-item.warning {
          background: #2d3748;
          color: #fef5e7;
        }

        body.dark-mode .error-item.info {
          background: #2d3748;
          color: #bee3f8;
        }

        body.dark-mode .error-item.success {
          background: #2d3748;
          color: #c6f6d5;
        }

        .error-time {
          color: #718096;
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
        }

        .error-type {
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .error-msg {
          line-height: 1.4;
        }

        .error-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f56565;
          color: white;
          border-radius: 10px;
          padding: 0.2rem 0.4rem;
          font-size: 0.7rem;
          font-weight: bold;
          min-width: 18px;
          text-align: center;
        }

        .no-errors {
          padding: 2rem;
          text-align: center;
          color: #718096;
        }

        body.dark-mode .no-errors {
          color: #a0aec0;
        }

        /* Games Grid */
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .game-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        body.dark-mode .game-card {
          background: #1a202c;
          color: #f7fafc;
        }

        .game-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .game-icon {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .game-title {
          font-size: 1.3rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1rem;
        }

        .game-desc {
          color: #666;
          text-align: center;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        body.dark-mode .game-desc {
          color: #a0aec0;
        }

        .play-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .loading {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        body.dark-mode .spinner {
          border-color: #4a5568;
          border-top-color: #667eea;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .hidden { display: none; }

        /* Share Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        body.dark-mode .modal {
          background: #1a202c;
          color: #f7fafc;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          margin: 0;
          font-size: 1.3rem;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #718096;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .modal-close:hover {
          background: #edf2f7;
          color: #2d3748;
        }

        body.dark-mode .modal-close {
          color: #a0aec0;
        }

        body.dark-mode .modal-close:hover {
          background: #4a5568;
          color: #f7fafc;
        }

        .share-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .share-btn {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        .share-btn.twitter { background: #1da1f2; }
        .share-btn.facebook { background: #4267b2; }
        .share-btn.linkedin { background: #0077b5; }
        .share-btn.copy { background: #718096; }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .content {
            padding: 1rem;
          }
          
          .error-panel {
            width: 100%;
            right: -100%;
          }
          
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
    </style>
</head>
<body>
    <!-- Status Indicator -->
    <div id="statusIndicator" class="status hidden">🎮 Initializing...</div>

    <!-- Header -->
    <div class="header">
        <div>
            <h1 class="title">🎮 Game Zone</h1>
            <p style="margin: 0.5rem 0 0 0; color: #666;">Challenge yourself with mini-games!</p>
        </div>
        <div class="controls">
            <button class="btn btn-primary" onclick="refreshGames()">🔄 Refresh</button>
            <button class="btn-toggle" onclick="toggleErrorLog()" title="Error Log" id="errorBtn">
                🐛
                <span id="errorCount" class="error-count hidden">0</span>
            </button>
            <button class="btn-toggle" onclick="toggleDarkMode()" title="Dark Mode" id="darkBtn">🌙</button>
        </div>
    </div>

    <!-- Main Content -->
    <div class="content">
        <!-- Loading -->
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <h3>Loading Games...</h3>
            <p>Preparing your gaming experience...</p>
        </div>

        <!-- Games Container -->
        <div id="gamesContainer" class="hidden">
            <h2 id="gamesTitle">Available Games</h2>
            <div id="gamesGrid" class="games-grid"></div>
        </div>

        <!-- Error State -->
        <div id="errorState" class="card hidden">
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Unable to Load Games</h3>
                <p>There was an issue connecting to the game database.</p>
                <button class="btn btn-primary" onclick="refreshGames()">Try Again</button>
            </div>
        </div>

        <!-- No Games State -->
        <div id="noGamesState" class="card hidden">
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">🎮</div>
                <h3>No Games Available</h3>
                <p>Games haven't been created yet. Use the background script to populate games!</p>
                <button class="btn btn-primary" onclick="refreshGames()">Check Again</button>
            </div>
        </div>

        <!-- Features Demo -->
        <div class="card">
            <h3>🎯 Platform Features</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 6px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌙</div>
                    <strong>Dark Mode</strong>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">Toggle theme with the moon button</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 6px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🐛</div>
                    <strong>Error Logging</strong>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">Track issues with the bug button</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 6px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
                    <strong>Score Sharing</strong>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">Share achievements on social media</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 6px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                    <strong>Real-time Updates</strong>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">Live error tracking and debugging</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Error Log Panel -->
    <div id="errorPanel" class="error-panel">
        <div class="error-header">
            <div style="font-weight: bold;">🐛 Error Log</div>
            <button class="error-close" onclick="toggleErrorLog()">×</button>
        </div>
        <div class="error-controls">
            <button class="error-btn" onclick="exportErrors()">📄 Export</button>
            <button class="error-btn clear" onclick="clearErrors()">🗑️ Clear</button>
            <button class="error-btn" onclick="testError()">🧪 Test</button>
        </div>
        <div class="error-list" id="errorList">
            <div class="no-errors">No errors logged yet</div>
        </div>
    </div>

    <!-- Share Modal -->
    <div id="shareModal" class="modal-overlay hidden">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">🎉 Great Game!</h3>
                <button class="modal-close" onclick="closeShareModal()">×</button>
            </div>
            <div>
                <p id="shareMessage">Share your achievement!</p>
                <div class="share-buttons">
                    <button class="share-btn twitter" onclick="shareScore('twitter')">🐦 Twitter</button>
                    <button class="share-btn facebook" onclick="shareScore('facebook')">📘 Facebook</button>
                    <button class="share-btn linkedin" onclick="shareScore('linkedin')">💼 LinkedIn</button>
                    <button class="share-btn copy" onclick="shareScore('copy')">📋 Copy</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        console.log('🎮 Game Zone Script Loading...');

        // Global State
        let darkMode = localStorage.getItem('gameZoneDarkMode') === 'true';
        let errorLogOpen = false;
        let errorLog = [];
        let currentShareData = null;

        // Show status message
        function showStatus(message, type = 'info') {
            const indicator = document.getElementById('statusIndicator');
            indicator.textContent = message;
            indicator.className = 'status';
            
            setTimeout(() => {
                indicator.classList.add('hidden');
            }, 3000);
        }

        // Error logging
        function logError(type, message, details = null) {
            const timestamp = new Date().toISOString();
            const entry = {
                id: Date.now() + Math.random(),
                timestamp,
                type,
                message,
                details
            };
            
            errorLog.push(entry);
            updateErrorDisplay();
            updateErrorCount();
            
            // Console logging
            const consoleMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
            console[consoleMethod](\`[GAME ZONE \${type.toUpperCase()}] \${message}\`, details || '');
        }

        function updateErrorDisplay() {
            const list = document.getElementById('errorList');
            
            if (errorLog.length === 0) {
                list.innerHTML = '<div class="no-errors">No errors logged yet</div>';
                return;
            }
            
            list.innerHTML = errorLog.slice(-50).reverse().map(entry => \`
                <div class="error-item \${entry.type}">
                    <div class="error-time">\${new Date(entry.timestamp).toLocaleString()}</div>
                    <div class="error-type">\${entry.type}</div>
                    <div class="error-msg">\${entry.message}</div>
                    \${entry.details ? \`<div style="font-size: 0.8rem; margin-top: 0.5rem; color: #666; background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px;">\${typeof entry.details === 'object' ? JSON.stringify(entry.details, null, 2) : entry.details}</div>\` : ''}
                </div>
            \`).join('');
        }

        function updateErrorCount() {
            const count = errorLog.filter(e => e.type === 'error').length;
            const badge = document.getElementById('errorCount');
            
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function clearErrors() {
            if (confirm('Clear all error logs?')) {
                errorLog = [];
                updateErrorDisplay();
                updateErrorCount();
                logError('info', 'Error log cleared by user');
            }
        }

        function exportErrors() {
            const data = JSON.stringify(errorLog, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`game-zone-errors-\${new Date().toISOString().split('T')[0]}.json\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logError('info', 'Error log exported');
        }

        function testError() {
            logError('error', 'Test error message', 'This is a test error for debugging purposes');
            logError('warning', 'Test warning message');
            logError('info', 'Test info message');
            logError('success', 'Test success message');
        }

        // Dark Mode Functions
        function toggleDarkMode() {
            try {
                darkMode = !darkMode;
                localStorage.setItem('gameZoneDarkMode', darkMode.toString());
                applyDarkMode();
                showStatus(darkMode ? '🌙 Dark Mode Enabled' : '☀️ Light Mode Enabled');
                logError('success', \`Dark mode toggled: \${darkMode ? 'ON' : 'OFF'}\`);
            } catch (error) {
                logError('error', 'Failed to toggle dark mode', error.message);
            }
        }

        function applyDarkMode() {
            try {
                const body = document.body;
                const btn = document.getElementById('darkBtn');
                
                if (darkMode) {
                    body.classList.add('dark-mode');
                    btn.textContent = '☀️';
                    btn.title = 'Switch to Light Mode';
                    logError('info', 'Dark mode applied - body class added');
                } else {
                    body.classList.remove('dark-mode');
                    btn.textContent = '🌙';
                    btn.title = 'Switch to Dark Mode';
                    logError('info', 'Light mode applied - body class removed');
                }
                
                // Update feature demo cards in dark mode
                const cards = document.querySelectorAll('[style*="background: #f7fafc"]');
                cards.forEach(card => {
                    if (darkMode) {
                        card.style.background = '#2d3748';
                        card.style.color = '#f7fafc';
                    } else {
                        card.style.background = '#f7fafc';
                        card.style.color = '#2d3748';
                    }
                });
                
            } catch (error) {
                logError('error', 'Failed to apply dark mode', error.message);
            }
        }

        // Error Log Panel
        function toggleErrorLog() {
            try {
                errorLogOpen = !errorLogOpen;
                const panel = document.getElementById('errorPanel');
                
                if (errorLogOpen) {
                    panel.classList.add('open');
                    logError('info', 'Error log panel opened');
                } else {
                    panel.classList.remove('open');
                    logError('info', 'Error log panel closed');
                }
            } catch (error) {
                logError('error', 'Failed to toggle error log', error.message);
            }
        }

        // Game Functions
        async function refreshGames() {
            try {
                showLoading();
                logError('info', 'Refreshing games...');
                
                const response = await fetch('/api/now/table/x_1599224_game_zon_games?sysparm_query=active=true&sysparm_display_value=all', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-UserToken': window.g_ck
                    }
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const data = await response.json();
                const games = data.result || [];
                
                logError('success', \`Games loaded: \${games.length} found\`, games);
                
                if (games.length === 0) {
                    showNoGames();
                } else {
                    displayGames(games);
                }
                
            } catch (error) {
                logError('error', 'Failed to load games', error.message);
                showError();
            }
        }

        function showLoading() {
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('gamesContainer').classList.add('hidden');
            document.getElementById('errorState').classList.add('hidden');
            document.getElementById('noGamesState').classList.add('hidden');
        }

        function showError() {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('gamesContainer').classList.add('hidden');
            document.getElementById('errorState').classList.remove('hidden');
            document.getElementById('noGamesState').classList.add('hidden');
        }

        function showNoGames() {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('gamesContainer').classList.add('hidden');
            document.getElementById('errorState').classList.add('hidden');
            document.getElementById('noGamesState').classList.remove('hidden');
        }

        function displayGames(games) {
            try {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('gamesContainer').classList.remove('hidden');
                document.getElementById('errorState').classList.add('hidden');
                document.getElementById('noGamesState').classList.add('hidden');
                
                const title = document.getElementById('gamesTitle');
                title.textContent = \`Available Games (\${games.length})\`;
                
                const grid = document.getElementById('gamesGrid');
                grid.innerHTML = '';
                
                games.forEach(game => {
                    const name = typeof game.name === 'object' ? game.name.display_value : game.name;
                    const desc = typeof game.description === 'object' ? game.description.display_value : game.description;
                    const maxScore = typeof game.max_score === 'object' ? game.max_score.display_value : game.max_score;
                    
                    const card = document.createElement('div');
                    card.className = 'game-card';
                    card.innerHTML = \`
                        <div class="game-icon">\${getGameIcon(name)}</div>
                        <h3 class="game-title">\${name}</h3>
                        <p class="game-desc">\${desc}</p>
                        <button class="play-btn" onclick="startGame('\${name}', \${maxScore})">🚀 Play Now</button>
                    \`;
                    grid.appendChild(card);
                });
                
                logError('success', \`\${games.length} games displayed successfully\`);
            } catch (error) {
                logError('error', 'Failed to display games', error.message);
            }
        }

        function getGameIcon(name) {
            switch(name?.toLowerCase()) {
                case 'chess': return '♛';
                case 'whack-a-mole': return '🔨';
                case 'sudoku': return '🔢';
                default: return '🎮';
            }
        }

        function startGame(name, maxScore) {
            try {
                logError('info', \`Starting game: \${name}\`);
                
                if (confirm(\`🎮 Start \${name}?\\n\\nThis is a demo simulation.\\nClick OK to play!\`)) {
                    setTimeout(() => {
                        const score = Math.floor(Math.random() * parseInt(maxScore) * 0.8) + 100;
                        showGameComplete(name, score);
                    }, 2000);
                }
            } catch (error) {
                logError('error', \`Failed to start game: \${name}\`, error.message);
            }
        }

        function showGameComplete(name, score) {
            try {
                currentShareData = { gameName: name, score: score };
                
                document.getElementById('shareMessage').innerHTML = \`
                    <strong>🎉 Game Complete!</strong><br>
                    You scored <strong>\${score.toLocaleString()}</strong> points in \${name}!<br><br>
                    Share your achievement:
                \`;
                
                document.getElementById('shareModal').classList.remove('hidden');
                logError('success', \`Game completed: \${name} - Score: \${score}\`);
            } catch (error) {
                logError('error', 'Failed to show game completion', error.message);
            }
        }

        function closeShareModal() {
            document.getElementById('shareModal').classList.add('hidden');
            currentShareData = null;
        }

        function shareScore(platform) {
            try {
                if (!currentShareData) return;
                
                const message = \`🎮 Just scored \${currentShareData.score.toLocaleString()} points in \${currentShareData.gameName} on Game Zone! 🏆\`;
                const url = window.location.href;
                
                switch (platform) {
                    case 'twitter':
                        window.open(\`https://twitter.com/intent/tweet?text=\${encodeURIComponent(message)}&url=\${encodeURIComponent(url)}\`, '_blank');
                        break;
                    case 'facebook':
                        window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}&quote=\${encodeURIComponent(message)}\`, '_blank');
                        break;
                    case 'linkedin':
                        window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}&title=\${encodeURIComponent(message)}\`, '_blank');
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(\`\${message} \${url}\`).then(() => {
                            alert('🎉 Score copied to clipboard!');
                            logError('success', 'Score shared via clipboard');
                        }).catch(() => {
                            logError('warning', 'Clipboard access failed, using fallback');
                            const textArea = document.createElement('textarea');
                            textArea.value = \`\${message} \${url}\`;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('🎉 Score copied to clipboard!');
                        });
                        break;
                }
                
                closeShareModal();
                logError('info', \`Score shared to \${platform}\`);
            } catch (error) {
                logError('error', \`Failed to share to \${platform}\`, error.message);
            }
        }

        // Event Listeners
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                toggleDarkMode();
            }
            if (e.altKey && e.key === 'e') {
                e.preventDefault();
                toggleErrorLog();
            }
            if (e.key === 'Escape') {
                if (errorLogOpen) {
                    toggleErrorLog();
                } else {
                    closeShareModal();
                }
            }
        });

        // Close share modal when clicking outside
        document.getElementById('shareModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });

        // Override console to capture errors
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = function(...args) {
            logError('error', args.join(' '), new Error().stack);
            originalError.apply(console, args);
        };

        console.warn = function(...args) {
            logError('warning', args.join(' '));
            originalWarn.apply(console, args);
        };

        // Capture unhandled errors
        window.addEventListener('error', function(e) {
            logError('error', \`Uncaught Error: \${e.message}\`, \`File: \${e.filename}, Line: \${e.lineno}\`);
        });

        window.addEventListener('unhandledrejection', function(e) {
            logError('error', \`Unhandled Promise Rejection: \${e.reason}\`, e.reason);
        });

        // Initialize App
        document.addEventListener('DOMContentLoaded', function() {
            try {
                logError('info', '🎮 Game Zone Initializing...', {
                    darkMode: darkMode,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                });
                
                applyDarkMode();
                refreshGames();
                showStatus('🎮 Game Zone Ready!');
                
                logError('success', '✅ Game Zone initialized successfully');
                
                // Show initial status
                setTimeout(() => {
                    if (darkMode) {
                        showStatus('🌙 Dark Mode Active');
                    }
                }, 1000);
                
            } catch (error) {
                logError('error', 'Failed to initialize Game Zone', error.message);
            }
        });

        console.log('🎮 Game Zone Script Loaded Successfully!');
        console.log('📋 Available Commands:');
        console.log('  - Alt+D: Toggle Dark Mode');
        console.log('  - Alt+E: Toggle Error Log');
        console.log('  - ESC: Close Modals');
    </script>
</body>
</html>
  `,
  direct: true
})