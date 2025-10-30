import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'

export function validateGameSession(current, previous) {
    // Validate game session data
    const status = current.getValue('status');
    const startTime = current.getValue('start_time');
    const endTime = current.getValue('end_time');
    const score = parseInt(current.getValue('score')) || 0;
    
    // Set end time if completed and not already set
    if (status === 'completed' && !endTime) {
        const now = new GlideDateTime();
        current.setValue('end_time', now.getDisplayValue());
    }
    
    // Calculate duration if both start and end times exist
    if (startTime && (endTime || status === 'completed')) {
        const start = new GlideDateTime();
        start.setValue(startTime);
        
        const end = new GlideDateTime();
        if (endTime) {
            end.setValue(endTime);
        } else {
            end = new GlideDateTime(); // Current time
        }
        
        const durationMs = end.getNumericValue() - start.getNumericValue();
        const durationSeconds = Math.floor(durationMs / 1000);
        current.setValue('duration', durationSeconds);
    }
    
    // Validate score ranges based on game
    const gameGR = new GlideRecord('x_1599224_game_zon_games');
    if (gameGR.get(current.getValue('game'))) {
        const maxScore = parseInt(gameGR.getValue('max_score')) || 0;
        
        if (score > maxScore && status === 'completed') {
            // Suspicious high score - flag for review
            current.setValue('status', 'disqualified');
            current.setValue('rules_violated', 'Score exceeds maximum possible for this game');
            gs.addErrorMessage('Invalid score detected. Session has been flagged.');
        }
    }
    
    // Log session completion
    if (status === 'completed') {
        gs.info('Game session completed - Player: ' + current.getDisplayValue('player') + 
                ', Game: ' + current.getDisplayValue('game') + 
                ', Score: ' + score);
    }
}