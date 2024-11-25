import UIManager from '../js/UIManager';

describe('UIManager Unit Tests', () => {
  let uiManager;

  beforeEach(() => {
    // Set up our document body
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

    uiManager = new UIManager();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize all required DOM elements', () => {
      expect(uiManager.gridElement).toBeTruthy();
      expect(uiManager.scoreElement).toBeTruthy();
      expect(uiManager.highScoreElement).toBeTruthy();
      expect(uiManager.gameOverElement).toBeTruthy();
    });

    test('should create 16 grid cells', () => {
      const cells = document.querySelectorAll('.grid-cell');
      expect(cells.length).toBe(16);
    });
  });

  describe('Score Management', () => {
    test('should update score display', () => {
      uiManager.updateScore(100);
      expect(uiManager.scoreElement.textContent).toBe('100');
    });

    test('should throw error for invalid score', () => {
      expect(() => uiManager.updateScore(-1)).toThrow('Invalid score');
      expect(() => uiManager.updateScore('invalid')).toThrow('Invalid score');
    });
  });

  describe('High Score Management', () => {
    test('should initialize with zero when no previous score exists', () => {
      expect(uiManager.highScoreElement.textContent).toBe('0');
    });

    test('should load existing high score from localStorage', () => {
      localStorage.setItem('highScore', '200');
      uiManager = new UIManager(); // Reinitialize to load from localStorage
      expect(uiManager.highScoreElement.textContent).toBe('200');
    });

    test('should update high score when current score is higher', () => {
      localStorage.setItem('highScore', '100');
      uiManager = new UIManager();
      uiManager.updateHighScore(150);
      expect(uiManager.highScoreElement.textContent).toBe('150');
      expect(localStorage.getItem('highScore')).toBe('150');
    });

    test('should not update high score when current score is lower', () => {
      localStorage.setItem('highScore', '200');
      uiManager = new UIManager();
      uiManager.updateHighScore(150);
      expect(uiManager.highScoreElement.textContent).toBe('200');
      expect(localStorage.getItem('highScore')).toBe('200');
    });
  });

  describe('Grid Management', () => {
    test('should create tile element with correct value and position', () => {
      const tile = uiManager.createTileElement(2, 0, 0);
      expect(tile.className).toContain('tile-2');
      expect(tile.textContent).toBe('2');
    });

    test('should throw error for invalid tile parameters', () => {
      // Test invalid value type
      expect(() => uiManager.createTileElement('invalid', 0, 0)).toThrow('Invalid tile parameters');
      
      // Test invalid row
      expect(() => uiManager.createTileElement(2, -1, 0)).toThrow('Invalid tile parameters');
      expect(() => uiManager.createTileElement(2, 4, 0)).toThrow('Invalid tile parameters');
      
      // Test invalid column
      expect(() => uiManager.createTileElement(2, 0, -1)).toThrow('Invalid tile parameters');
      expect(() => uiManager.createTileElement(2, 0, 4)).toThrow('Invalid tile parameters');
    });
  });

  describe('Game Over Management', () => {
    test('should show game over screen with final score', () => {
      uiManager.showGameOver(500);
      expect(uiManager.gameOverElement.classList.contains('hidden')).toBe(false);
      expect(uiManager.finalScoreElement.textContent).toBe('500');
    });

    test('should hide game over screen', () => {
      uiManager.showGameOver(500);
      uiManager.hideGameOver();
      expect(uiManager.gameOverElement.classList.contains('hidden')).toBe(true);
    });
  });
});
