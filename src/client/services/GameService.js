class GameService {
  constructor() {
    this.gamesTable = "x_1599224_game_zon_games";
    this.sessionsTable = "x_1599224_game_zon_sessions";
    this.playerLevelsTable = "x_1599224_game_zon_player_levels";
  }

  async getGames() {
    try {
      const response = await fetch(`/api/now/table/${this.gamesTable}?sysparm_query=active=true&sysparm_display_value=all`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { result } = await response.json();
      return result || [];
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async getUserProfile() {
    try {
      // Get current user info
      const userResponse = await fetch('/api/now/v1/ui/user', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      
      // Get player level data
      const playerId = userData.result?.sys_id || 'current_user';
      const levelResponse = await fetch(`/api/now/table/${this.playerLevelsTable}?sysparm_query=player=${playerId}&sysparm_display_value=all`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      let totalScore = 0;
      let level = 1;
      let experience = 0;

      if (levelResponse.ok) {
        const levelData = await levelResponse.json();
        if (levelData.result?.length > 0) {
          // Aggregate stats from all games
          levelData.result.forEach(record => {
            totalScore += parseInt(record.total_score?.display_value || '0');
            experience += parseInt(record.experience_points?.display_value || '0');
          });
          level = Math.floor(experience / 1000) + 1;
        }
      }

      return {
        name: userData.result?.name || 'Player',
        level: level,
        experience: experience,
        totalScore: totalScore
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        name: 'Player',
        level: 1,
        experience: 0,
        totalScore: 0
      };
    }
  }

  async getUserSessions() {
    try {
      const userResponse = await fetch('/api/now/v1/ui/user', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const playerId = userData.result?.sys_id || 'current_user';

      const response = await fetch(`/api/now/table/${this.sessionsTable}?sysparm_query=player=${playerId}&sysparm_orderby=start_time&sysparm_orderby_desc=true&sysparm_limit=20&sysparm_display_value=all`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { result } = await response.json();
      return result || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async saveGameSession(gameData) {
    try {
      const userResponse = await fetch('/api/now/v1/ui/user', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const playerId = userData.result?.sys_id || 'current_user';

      const sessionData = {
        game: gameData.gameId,
        player: playerId,
        start_time: gameData.startTime,
        end_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        final_score: gameData.finalScore.toString(),
        status: gameData.won ? 'completed' : 'failed',
        time_spent: gameData.timeSpent?.toString() || '0',
        rules_violated: gameData.rulesViolated || ''
      };

      const response = await fetch(`/api/now/table/${this.sessionsTable}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update player stats
      await this.updatePlayerStats(gameData.gameId, gameData.finalScore, gameData.won);
      
      return result.result;
    } catch (error) {
      console.error('Error saving game session:', error);
      throw error;
    }
  }

  async updatePlayerStats(gameId, sessionScore, won) {
    try {
      const userResponse = await fetch('/api/now/v1/ui/user', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const playerId = userData.result?.sys_id || 'current_user';

      // Check if player already has stats for this game
      const statsResponse = await fetch(`/api/now/table/${this.playerLevelsTable}?sysparm_query=player=${playerId}^game=${gameId}&sysparm_display_value=all`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });

      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      const existingStats = statsData.result?.length > 0 ? statsData.result[0] : null;

      if (!existingStats) {
        // Create new player level record
        const newStats = {
          player: playerId,
          game: gameId,
          current_level: '1',
          total_score: sessionScore.toString(),
          games_won: won ? '1' : '0',
          games_played: '1',
          experience_points: Math.floor(sessionScore / 10).toString(),
          win_percentage: won ? '100' : '0'
        };

        const response = await fetch(`/api/now/table/${this.playerLevelsTable}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          },
          body: JSON.stringify(newStats),
        });

        return await response.json();
      } else {
        // Update existing stats
        const statsId = typeof existingStats.sys_id === 'object' ? existingStats.sys_id.value : existingStats.sys_id;
        const currentScore = parseInt(existingStats.total_score?.display_value || '0');
        const currentWins = parseInt(existingStats.games_won?.display_value || '0');
        const currentPlayed = parseInt(existingStats.games_played?.display_value || '0');
        const currentExp = parseInt(existingStats.experience_points?.display_value || '0');
        
        const newTotalScore = currentScore + sessionScore;
        const newGamesWon = currentWins + (won ? 1 : 0);
        const newGamesPlayed = currentPlayed + 1;
        const newExp = currentExp + Math.floor(sessionScore / 10);
        const newLevel = Math.floor(newExp / 1000) + 1;
        const winPercentage = Math.round((newGamesWon / newGamesPlayed) * 100);

        const updates = {
          total_score: newTotalScore.toString(),
          games_won: newGamesWon.toString(),
          games_played: newGamesPlayed.toString(),
          experience_points: newExp.toString(),
          current_level: newLevel.toString(),
          win_percentage: winPercentage.toString()
        };

        const response = await fetch(`/api/now/table/${this.playerLevelsTable}/${statsId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          },
          body: JSON.stringify(updates),
        });

        return await response.json();
      }
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }
}

const gameService = new GameService();
export default gameService;