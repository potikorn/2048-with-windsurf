import Game from '../js/Game.js';
import GameState from '../js/GameState.js';

describe('Game Logic Tests', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(4, false);
  });

  describe('Game Initialization', () => {
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
  });

  describe('Game Moves', () => {
    beforeEach(() => {
      // Set up a consistent game state for move tests
      gameState.grid = [
        [2, 0, 2, 0],
        [0, 4, 4, 0],
        [8, 0, 8, 0],
        [0, 0, 0, 2]
      ];
    });

    test('should add exactly one new tile after valid move', () => {
      const initialNonZeroCount = gameState.grid.flat().filter(value => value !== 0).length;
      const result = gameState.move('ArrowLeft');
      expect(result.moved).toBe(true);

      const afterMoveCount = gameState.grid.flat().filter(value => value !== 0).length;
      expect(afterMoveCount).toBe(5); // After merging (4) + new tile (1)
    });

    test('should move and merge tiles left correctly', () => {
      const result = gameState.move('ArrowLeft');
      expect(result.moved).toBe(true);

      // Check merges
      expect(gameState.grid[0][0]).toBe(4);  // 2+2
      expect(gameState.grid[1][0]).toBe(8);  // 4+4
      expect(gameState.grid[2][0]).toBe(16); // 8+8
      expect(gameState.grid[3][0]).toBe(2);  // moved left
    });

    test('should move and merge tiles right correctly', () => {
      const result = gameState.move('ArrowRight');
      expect(result.moved).toBe(true);

      // Check merges
      expect(gameState.grid[0][3]).toBe(4);  // 2+2
      expect(gameState.grid[1][3]).toBe(8);  // 4+4
      expect(gameState.grid[2][3]).toBe(16); // 8+8
      expect(gameState.grid[3][3]).toBe(2);  // moved right
    });

    test('should move and merge tiles up correctly', () => {
      gameState.grid = [
        [2, 4, 0, 2],
        [2, 4, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const result = gameState.move('ArrowUp');
      expect(result.moved).toBe(true);

      expect(gameState.grid[0][0]).toBe(4); // 2+2
      expect(gameState.grid[0][1]).toBe(8); // 4+4
      expect(gameState.grid[0][3]).toBe(4); // 2+2
    });

    test('should move and merge tiles down correctly', () => {
      gameState.grid = [
        [2, 4, 0, 2],
        [2, 4, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const result = gameState.move('ArrowDown');
      expect(result.moved).toBe(true);

      expect(gameState.grid[3][0]).toBe(4); // 2+2
      expect(gameState.grid[3][1]).toBe(8); // 4+4
      expect(gameState.grid[3][3]).toBe(4); // 2+2
    });
  });

  describe('Game State', () => {
    test('should detect game over correctly', () => {
      // Set up a grid where no moves are possible
      gameState.grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ];

      // Try all possible moves to trigger game over state
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(move => {
        gameState.move(move);
      });

      expect(gameState.isGameOver).toBe(true);
    });

    test('should continue game when moves are possible', () => {
      gameState.grid = [
        [2, 2, 4, 8],
        [4, 0, 2, 4],
        [2, 4, 2, 8],
        [4, 2, 4, 2]
      ];

      expect(gameState.isGameOver).toBe(false);
    });
  });
});
