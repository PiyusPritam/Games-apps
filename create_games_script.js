// ServiceNow Background Script to Create Games
// Run this in System Definition > Scripts - Background

// Create Chess Game
var chessGame = new GlideRecord('x_1599224_game_zon_games');
chessGame.initialize();
chessGame.setValue('name', 'Chess');
chessGame.setValue('description', 'Classic strategy board game for two players. Checkmate the opponent king to win.');
chessGame.setValue('difficulty_level', '8');
chessGame.setValue('max_score', '2000');
chessGame.setValue('time_limit', '1800');
chessGame.setValue('active', 'true');
chessGame.setValue('rules', 'Move pieces according to their patterns. White moves first, then players alternate. Invalid moves result in disqualification. Capture the king to win.');
var chessId = chessGame.insert();
gs.info('Chess game created with ID: ' + chessId);

// Create Whack-a-Mole Game
var moleGame = new GlideRecord('x_1599224_game_zon_games');
moleGame.initialize();
moleGame.setValue('name', 'Whack-a-Mole');
moleGame.setValue('description', 'Fast-paced reaction game. Hit the moles as they appear to score points.');
moleGame.setValue('difficulty_level', '4');
moleGame.setValue('max_score', '5000');
moleGame.setValue('time_limit', '120');
moleGame.setValue('active', 'true');
moleGame.setValue('rules', 'Click moles when they appear for points. Golden moles: +50pts, Regular: +10pts, Bombs: -25pts. No spam clicking allowed.');
var moleId = moleGame.insert();
gs.info('Whack-a-Mole game created with ID: ' + moleId);

// Create Sudoku Game
var sudokuGame = new GlideRecord('x_1599224_game_zon_games');
sudokuGame.initialize();
sudokuGame.setValue('name', 'Sudoku');
sudokuGame.setValue('description', 'Number puzzle game. Fill the 9x9 grid so each row, column, and 3x3 box contains digits 1-9.');
sudokuGame.setValue('difficulty_level', '6');
sudokuGame.setValue('max_score', '3000');
sudokuGame.setValue('time_limit', '900');
sudokuGame.setValue('active', 'true');
sudokuGame.setValue('rules', 'Fill 9x9 grid with digits 1-9. Each row, column, and 3x3 box must contain all digits with no repetition. Hints reduce score.');
var sudokuId = sudokuGame.insert();
gs.info('Sudoku game created with ID: ' + sudokuId);

gs.info('All games created successfully!');
gs.info('Access your Game Zone at: https://dev186413.service-now.com/x_1599224_game_zon_game_zone.do');