import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'

export function updatePlayerLevel(current, previous) {
    // This function runs when a game session is completed
    if (current.getValue('status') !== 'completed') {
        return;
    }

    const playerId = current.getValue('player');
    const gameId = current.getValue('game');
    const sessionScore = parseInt(current.getValue('score')) || 0;
    
    // Find or create player level record
    const playerLevelGR = new GlideRecord('x_1599224_game_zon_player_levels');
    playerLevelGR.addQuery('player', playerId);
    playerLevelGR.addQuery('game', gameId);
    playerLevelGR.query();
    
    if (playerLevelGR.next()) {
        // Update existing record
        const currentScore = parseInt(playerLevelGR.getValue('total_score')) || 0;
        const currentWins = parseInt(playerLevelGR.getValue('games_won')) || 0;
        const currentPlayed = parseInt(playerLevelGR.getValue('games_played')) || 0;
        const currentExp = parseInt(playerLevelGR.getValue('experience_points')) || 0;
        
        const newTotalScore = currentScore + sessionScore;
        const newGamesWon = currentWins + (sessionScore > 0 ? 1 : 0);
        const newGamesPlayed = currentPlayed + 1;
        const newExp = currentExp + Math.floor(sessionScore / 10);
        const newLevel = Math.floor(newExp / 1000) + 1;
        const winPercentage = Math.round((newGamesWon / newGamesPlayed) * 100);
        
        playerLevelGR.setValue('total_score', newTotalScore);
        playerLevelGR.setValue('games_won', newGamesWon);
        playerLevelGR.setValue('games_played', newGamesPlayed);
        playerLevelGR.setValue('experience_points', newExp);
        playerLevelGR.setValue('current_level', newLevel);
        playerLevelGR.setValue('win_percentage', winPercentage);
        
        // Check for achievements
        const achievements = [];
        if (newGamesWon === 1) achievements.push('First Victory');
        if (newGamesWon === 10) achievements.push('Veteran Player');
        if (newGamesWon === 50) achievements.push('Game Master');
        if (newLevel >= 5) achievements.push('Level 5 Achieved');
        if (newLevel >= 10) achievements.push('Elite Player');
        if (winPercentage >= 80) achievements.push('High Win Rate');
        
        if (achievements.length > 0) {
            const existingAchievements = playerLevelGR.getValue('achievements') || '';
            const newAchievements = existingAchievements + (existingAchievements ? ', ' : '') + achievements.join(', ');
            playerLevelGR.setValue('achievements', newAchievements);
        }
        
        playerLevelGR.update();
        
        // Show level up message
        if (Math.floor((currentExp) / 1000) + 1 < newLevel) {
            gs.addInfoMessage('Congratulations! You reached Level ' + newLevel + '!');
        }
        
    } else {
        // Create new player level record
        playerLevelGR.initialize();
        playerLevelGR.setValue('player', playerId);
        playerLevelGR.setValue('game', gameId);
        playerLevelGR.setValue('total_score', sessionScore);
        playerLevelGR.setValue('games_won', sessionScore > 0 ? 1 : 0);
        playerLevelGR.setValue('games_played', 1);
        playerLevelGR.setValue('experience_points', Math.floor(sessionScore / 10));
        playerLevelGR.setValue('current_level', 1);
        playerLevelGR.setValue('win_percentage', sessionScore > 0 ? 100 : 0);
        playerLevelGR.setValue('achievements', 'First Game Played');
        playerLevelGR.insert();
        
        gs.addInfoMessage('Welcome to the game! You earned ' + Math.floor(sessionScore / 10) + ' experience points!');
    }
}