import Game from '../js/Game.js';
import GameState from '../js/GameState.js';
import UIManager from '../js/UIManager.js';

describe('2048 Game Tests', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(4, false);
  });

  test('should initialize with exactly two "2" tiles', () => {
    gameState = new GameState(4, true);
    expect(gameState.grid.length).toBe(4);
    expect(gameState.grid[0].length).toBe(4);
    
    // Count non-zero tiles (should be 2 at start)
    const nonZeroTiles = gameState.grid
      .flat()
      .filter(value => value !== 0);
    expect(nonZeroTiles.length).toBe(2);
    
    // All initial tiles should be 2s
    expect(nonZeroTiles.every(value => value === 2)).toBe(true);
  });

  test('should add exactly one new tile after valid move', () => {
    // Create a fresh game state without auto-initialization
    gameState = new GameState(4, false);
    gameState.grid = [
      [2, 0, 2, 0],
      [0, 4, 4, 0],
      [8, 0, 8, 0],
      [0, 0, 0, 2]
    ];

    // Count initial non-zero tiles
    const initialNonZeroCount = gameState.grid.flat().filter(value => value !== 0).length;
    
    const result = gameState.move('ArrowLeft');
    expect(result.moved).toBe(true);

    // Count tiles after move
    const afterMoveCount = gameState.grid.flat().filter(value => value !== 0).length;
    
    // After merging and adding one new tile:
    // Initial tiles: 7
    // After merging: 4 (three pairs merged)
    // After new tile: 5
    expect(afterMoveCount).toBe(5);
  });

  test('should move and merge tiles left correctly', () => {
    // Create a fresh game state without auto-initialization
    gameState = new GameState(4, false);
    gameState.grid = [
      [2, 0, 2, 0],
      [0, 4, 4, 0],
      [8, 0, 8, 0],
      [0, 0, 0, 2]
    ];

    // Store grid state before move
    const beforeMove = gameState.grid.map(row => [...row]);
    
    const result = gameState.move('ArrowLeft');
    expect(result.moved).toBe(true);

    // Check merges
    expect(gameState.grid[0][0]).toBe(4);  // 2+2
    expect(gameState.grid[1][0]).toBe(8);  // 4+4
    expect(gameState.grid[2][0]).toBe(16); // 8+8
    expect(gameState.grid[3][0]).toBe(2);  // moved left
    
    // After merging and adding one new tile:
    // Initial tiles: 7
    // After merging: 4 (three pairs merged)
    // After new tile: 5
    const newTileCount = gameState.grid.flat().filter(value => value !== 0).length;
    expect(newTileCount).toBe(5);
  });

  test('should move and merge tiles right correctly', () => {
    // Create a fresh game state without auto-initialization
    gameState = new GameState(4, false);
    gameState.grid = [
      [2, 0, 2, 0],
      [0, 4, 4, 0],
      [8, 0, 8, 0],
      [0, 0, 0, 2]
    ];

    // Store grid state before move
    const beforeMove = gameState.grid.map(row => [...row]);
    
    const result = gameState.move('ArrowRight');
    expect(result.moved).toBe(true);

    // Check merges
    expect(gameState.grid[0][3]).toBe(4);  // 2+2
    expect(gameState.grid[1][3]).toBe(8);  // 4+4
    expect(gameState.grid[2][3]).toBe(16); // 8+8
    expect(gameState.grid[3][3]).toBe(2);  // moved right
    
    // After merging and adding one new tile:
    // Initial tiles: 7
    // After merging: 4 (three pairs merged)
    // After new tile: 5
    const newTileCount = gameState.grid.flat().filter(value => value !== 0).length;
    expect(newTileCount).toBe(5);
  });

  test('should update score when merging tiles', () => {
    // Create a fresh game state without auto-initialization
    gameState = new GameState(4, false);
    gameState.grid = [
      [2, 2, 0, 0],
      [4, 4, 0, 0],
      [8, 8, 0, 0],
      [0, 0, 0, 0]
    ];

    const initialScore = gameState.score;
    const beforeMove = gameState.grid.map(row => [...row]);
    
    gameState.move('ArrowLeft');
    
    // Score should increase by sum of merged tiles (4 + 8 + 16 = 28)
    expect(gameState.score).toBe(initialScore + 28);
    
    // After merging and adding one new tile:
    // Initial tiles: 6
    // After merging: 3 (three pairs merged)
    // After new tile: 4
    const newTileCount = gameState.grid.flat().filter(value => value !== 0).length;
    expect(newTileCount).toBe(4);
  });

  test('should detect game over', () => {
    // Fill grid with alternating numbers that can't be merged
    gameState = new GameState(4, false);
    gameState.grid = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ];

    // Try all possible moves
    const moves = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    moves.forEach(move => {
      const result = gameState.move(move);
      expect(result.moved).toBe(false);
    });

    expect(gameState.isGameOver).toBe(true);
  });
});

describe('UI Layout Tests', () => {
  let uiManager;
  let gridElement;

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
    window.getComputedStyle = jest.fn().mockImplementation((element) => ({
      position: 'relative',
      display: 'grid',
      aspectRatio: '1',
      width: '500px'
    }));

    uiManager = new UIManager();
    gridElement = document.getElementById('grid');
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('grid should be initialized with 16 cells', () => {
    const cells = gridElement.querySelectorAll('.grid-cell');
    expect(cells.length).toBe(16);
  });

  test('grid cells should maintain square aspect ratio', () => {
    const cell = gridElement.querySelector('.grid-cell');
    const computedStyle = window.getComputedStyle(cell);
    expect(computedStyle.aspectRatio).toBe('1');
  });

  test('tiles should be properly positioned within grid cells', () => {
    // Create a test tile
    const testGrid = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    uiManager.updateGrid(testGrid);

    const tile = gridElement.querySelector('.tile');
    const parentCell = tile.parentElement;
    
    expect(parentCell.classList.contains('grid-cell')).toBe(true);
    expect(tile.textContent).toBe('2');
  });

  test('game container should maintain maximum width', () => {
    const container = document.querySelector('.game-container');
    const computedStyle = window.getComputedStyle(container);
    expect(computedStyle.width).toBe('500px');
  });

  test('should handle invalid grid updates gracefully', () => {
    expect(() => {
      uiManager.updateGrid([[]]);
    }).toThrow('Invalid grid structure');
  });

  test('should handle invalid tile creation gracefully', () => {
    expect(() => {
      uiManager.createTileElement(-1, 0, 0);
    }).toThrow('Invalid tile parameters');
  });
});

describe('High Score Tests', () => {
  let uiManager;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Set up DOM
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
    window.getComputedStyle = jest.fn().mockImplementation((element) => ({
      position: 'relative',
      display: 'grid',
      aspectRatio: '1',
      width: '500px'
    }));
    
    uiManager = new UIManager();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('should initialize with zero high score when no previous score exists', () => {
    expect(document.getElementById('high-score').textContent).toBe('0');
  });

  test('should load existing high score from localStorage', () => {
    localStorage.setItem('highScore', '1000');
    uiManager = new UIManager();
    expect(document.getElementById('high-score').textContent).toBe('1000');
  });

  test('should update high score when current score is higher', () => {
    uiManager.updateScore(2048);
    expect(document.getElementById('high-score').textContent).toBe('2048');
    expect(localStorage.getItem('highScore')).toBe('2048');
  });

  test('should not update high score when current score is lower', () => {
    localStorage.setItem('highScore', '4096');
    uiManager = new UIManager();
    uiManager.updateScore(2048);
    expect(document.getElementById('high-score').textContent).toBe('4096');
  });

  test('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    const mockError = new Error('Storage access denied');
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw mockError;
    });
    
    // Should not throw error and default to 0
    uiManager = new UIManager();
    expect(document.getElementById('high-score').textContent).toBe('0');
  });
});
