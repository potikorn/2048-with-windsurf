// Handles all UI-related operations
class UIManager {
  constructor() {
    this.initializeElements();
    this.previousTilePositions = new Map();
    this.validateLayout();
    this.loadHighScore();
  }

  validateLayout() {
    // Check if all required elements exist
    const requiredElements = {
      grid: this.gridElement,
      score: this.scoreElement,
      highScore: this.highScoreElement,
      gameOver: this.gameOverElement,
      finalScore: this.finalScoreElement,
      menuButton: this.menuButton,
      restartButton: this.restartButton
    };

    for (const [name, element] of Object.entries(requiredElements)) {
      if (!element) {
        throw new Error(`Required element "${name}" not found in the DOM`);
      }
    }

    // Validate grid container dimensions
    const container = this.gridElement.closest('.game-container');
    if (!container) {
      throw new Error('Grid container not found');
    }

    const style = window.getComputedStyle(container);
    if (style.position !== 'relative') {
      console.warn('Game container should have position: relative');
    }

    // Validate grid layout
    const gridStyle = window.getComputedStyle(this.gridElement);
    if (gridStyle.display !== 'grid') {
      throw new Error('Grid element must use CSS Grid layout');
    }
  }

  initializeElements() {
    try {
      // Cache DOM elements
      this.gridElement = document.getElementById('grid');
      this.scoreElement = document.getElementById('score');
      this.highScoreElement = document.getElementById('high-score');
      this.gameOverElement = document.getElementById('game-over');
      this.finalScoreElement = document.getElementById('final-score');
      this.menuButton = document.getElementById('menu-button');
      this.restartButton = document.getElementById('restart-button');
      
      // Set up grid cells
      this.setupGrid();
    } catch (error) {
      console.error('Failed to initialize UI elements:', error);
      throw error;
    }
  }

  loadHighScore() {
    try {
      const highScore = localStorage.getItem('highScore') || 0;
      this.highScoreElement.textContent = parseInt(highScore);
    } catch (error) {
      console.warn('Failed to load high score:', error);
      // Fallback to 0 if localStorage fails
      this.highScoreElement.textContent = 0;
    }
  }

  updateHighScore(score) {
    try {
      const storedHighScore = parseInt(localStorage.getItem('highScore')) || 0;
      if (score > storedHighScore) {
        this.highScoreElement.textContent = score;
        this.highScoreElement.classList.add('updated');
        localStorage.setItem('highScore', score.toString());
        
        setTimeout(() => {
          this.highScoreElement.classList.remove('updated');
        }, 300);
      }
    } catch (error) {
      console.error('Failed to update high score:', error);
    }
  }

  setupGrid() {
    if (!this.gridElement) {
      throw new Error('Grid element not found');
    }

    try {
      // Clear existing grid
      this.gridElement.innerHTML = '';
      
      // Create grid cells (4x4)
      for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        this.gridElement.appendChild(cell);
      }

      // Validate grid setup
      const cells = this.gridElement.querySelectorAll('.grid-cell');
      if (cells.length !== 16) {
        throw new Error(`Invalid grid setup: expected 16 cells, got ${cells.length}`);
      }
    } catch (error) {
      console.error('Failed to setup grid:', error);
      throw error;
    }
  }

  updateScore(score) {
    if (typeof score !== 'number' || score < 0) {
      throw new Error('Invalid score');
    }

    try {
      this.scoreElement.textContent = score;
      this.scoreElement.classList.add('updated');
      setTimeout(() => {
        this.scoreElement.classList.remove('updated');
      }, 300);
      
      // Check for new high score
      this.updateHighScore(score);
    } catch (error) {
      console.error('Failed to update score:', error);
      throw error;
    }
  }

  createTileElement(value, row, col) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('Invalid tile parameters');
    }

    if (!Number.isInteger(row) || row < 0 || row >= 4 || !Number.isInteger(col) || col < 0 || col >= 4) {
      throw new Error('Invalid tile parameters');
    }

    try {
      const tile = document.createElement('div');
      tile.className = `tile tile-${value}`;
      tile.textContent = value;
      
      // Find the target grid cell
      const cells = this.gridElement.children;
      const targetCell = cells[row * 4 + col];
      
      if (!targetCell) {
        throw new Error(`Internal error: Grid cell not found at [${row}, ${col}]`);
      }
      
      targetCell.appendChild(tile);
      return tile;
    } catch (error) {
      console.error('Failed to create tile:', error);
      throw error;
    }
  }

  updateGrid(grid, mergedTiles = []) {
    if (!Array.isArray(grid) || grid.length !== 4 || grid.some(row => !Array.isArray(row) || row.length !== 4)) {
      throw new Error('Invalid grid structure');
    }

    try {
      // Remove old tiles
      const tiles = this.gridElement.querySelectorAll('.tile');
      tiles.forEach(tile => tile.remove());

      // Add new tiles
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] !== 0) {
            const tile = this.createTileElement(grid[row][col], row, col);
            
            // Add animation classes
            if (mergedTiles.some(t => t.row === row && t.col === col)) {
              tile.classList.add('merge');
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to update grid:', error);
      throw error;
    }
  }

  markTileAsNew(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      throw new Error('Invalid tile position');
    }

    try {
      const tile = this.gridElement.querySelector(
        `.tile[style*="grid-row: ${row + 1}"][style*="grid-column: ${col + 1}"]`
      );
      
      if (tile) {
        tile.classList.add('new');
        setTimeout(() => tile.classList.remove('new'), 300);
      }
    } catch (error) {
      console.error('Failed to mark tile as new:', error);
      throw error;
    }
  }

  showGameOver(finalScore) {
    if (typeof finalScore !== 'number' || finalScore < 0) {
      throw new Error('Invalid final score');
    }

    try {
      this.finalScoreElement.textContent = finalScore;
      this.gameOverElement.classList.remove('hidden');
    } catch (error) {
      console.error('Failed to show game over:', error);
      throw error;
    }
  }

  hideGameOver() {
    try {
      this.gameOverElement.classList.add('hidden');
    } catch (error) {
      console.error('Failed to hide game over:', error);
      throw error;
    }
  }

  setupEventListeners(callbacks) {
    const { onMove, onRestart, onNewGame } = callbacks;

    if (typeof onMove !== 'function' || typeof onRestart !== 'function' || typeof onNewGame !== 'function') {
      throw new Error('Invalid callback functions');
    }

    try {
      // Keyboard controls
      document.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          onMove(e.key);
        }
      });

      // Touch controls
      let touchStartX = 0;
      let touchStartY = 0;
      const minSwipeDistance = 50;

      document.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });

      document.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Only trigger move if swipe distance is significant
        if (Math.abs(diffX) > minSwipeDistance || Math.abs(diffY) > minSwipeDistance) {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            onMove(diffX > 0 ? 'ArrowRight' : 'ArrowLeft');
          } else {
            onMove(diffY > 0 ? 'ArrowDown' : 'ArrowUp');
          }
        }
      });

      // Button controls
      this.restartButton.addEventListener('click', onRestart);
      this.menuButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to start a new game?')) {
          onNewGame();
        }
      });
    } catch (error) {
      console.error('Failed to setup event listeners:', error);
      throw error;
    }
  }
}

export default UIManager;
