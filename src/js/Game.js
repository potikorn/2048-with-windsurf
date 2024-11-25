import GameState from './GameState.js';
import UIManager from './UIManager.js';

class Game {
  constructor() {
    this.gameState = new GameState();
    this.uiManager = new UIManager();
    this.initialize();
  }

  initialize() {
    this.gameState.reset();
    this.uiManager.hideGameOver();

    // Initial render
    this.updateUI();

    // Setup event listeners
    this.uiManager.setupEventListeners({
      onMove: direction => this.handleMove(direction),
      onRestart: () => this.initialize(),
      onNewGame: () => this.initialize(),
    });
  }

  handleMove(direction) {
    const result = this.gameState.move(direction);

    if (result.moved) {
      // Update UI with merged tiles information
      this.uiManager.updateGrid(this.gameState.grid, result.mergedTiles);
      this.uiManager.updateScore(this.gameState.score);

      // Check for game over
      if (result.isGameOver) {
        this.uiManager.showGameOver(this.gameState.score);
      }
    }
  }

  updateUI() {
    this.uiManager.updateGrid(this.gameState.grid);
    this.uiManager.updateScore(this.gameState.score);
  }
}

// Initialize the game when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.gameState.addRandomTile();
    game.gameState.addRandomTile();
  });
}

export default Game;
