import Game from '../js/Game.js';
import GameState from '../js/GameState.js';
import UIManager from '../js/UIManager.js';

describe('2048 Game Integration Tests', () => {
  let game;
  let uiManager;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <div class="header">
          <div class="title-section">
            <h1>2048</h1>
            <button id="menu-button" class="menu-button">New Game</button>
          </div>
          <div class="scores-section">
            <div class="score-container">
              <div class="score-label">Score</div>
              <div id="score">0</div>
            </div>
            <div class="score-container">
              <div class="score-label">Best</div>
              <div id="high-score">0</div>
            </div>
          </div>
        </div>
        <div class="game-container">
          <div id="grid"></div>
          <div id="game-over" class="game-over hidden">
            <div class="game-over-content">
              <h2>Game Over!</h2>
              <p>Final Score: <span id="final-score">0</span></p>
              <button id="restart-button">Play Again</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Mock window.getComputedStyle
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      position: 'relative',
      display: 'grid',
      aspectRatio: '1',
      width: '500px'
    }));

    // Mock confirm dialog
    window.confirm = jest.fn(() => true);

    localStorage.clear();
    uiManager = new UIManager();
    game = new Game(uiManager);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Game Flow Integration', () => {
    test('should initialize game with UI correctly', () => {
      expect(document.querySelectorAll('.grid-cell').length).toBe(16);
      expect(document.querySelectorAll('.tile').length).toBe(2);
      expect(document.getElementById('score').textContent).toBe('0');
    });

    test('should update UI after valid move', () => {
      // Simulate keyboard event
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);

      // Check that tiles were updated
      const tiles = document.querySelectorAll('.tile');
      expect(tiles.length).toBeGreaterThan(0);
    });

    test('should update score and high score after merging', async () => {
      // Reset game state
      game.initialize();
      
      // Set up a game state where merging is guaranteed
      game.gameState.grid = [
        [2, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      game.updateUI();

      // Simulate move
      game.handleMove('ArrowLeft');

      // Wait for UI updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check score update
      expect(parseInt(document.getElementById('score').textContent)).toBe(4);
      
      // High score should be updated too
      expect(parseInt(document.getElementById('high-score').textContent)).toBe(4);
      expect(localStorage.getItem('highScore')).toBe('4');
    });

    test('should show game over screen when no moves possible', () => {
      // Reset game state
      game.initialize();
      
      // Set up a game over state
      game.gameState.grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ];
      game.updateUI();

      // Try to make a move to trigger game over check
      game.handleMove('ArrowLeft');

      // Game over screen should be visible
      expect(document.getElementById('game-over').classList.contains('hidden')).toBe(false);
    });

    test('should restart game when new game button is clicked', () => {
      // Set up a game in progress
      game.gameState.grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ];
      
      // Mock confirm to return true
      window.confirm.mockImplementation(() => true);
      
      // Click new game button
      document.getElementById('menu-button').click();

      // Check game was reset
      expect(document.querySelectorAll('.tile').length).toBe(2);
      expect(document.getElementById('score').textContent).toBe('0');
      expect(document.getElementById('game-over').classList.contains('hidden')).toBe(true);
    });
  });
});
