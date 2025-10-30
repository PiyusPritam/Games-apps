import React from 'react';
import ReactDOM from 'react-dom/client';
import GameZoneApp from './GameZoneApp.jsx';

console.log('Loading Game Zone Application...');

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <GameZoneApp />
    </React.StrictMode>
  );
  console.log('Game Zone Application loaded successfully!');
} catch (error) {
  console.error('Error loading Game Zone Application:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 2rem; color: white; text-align: center;">
      <h1>🎮 Game Zone</h1>
      <h2>Error Loading Application</h2>
      <p>Error: ${error.message}</p>
      <p>Please refresh the page or contact support.</p>
    </div>
  `;
}