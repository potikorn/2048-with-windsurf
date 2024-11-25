// Handles the core game state and logic
class GameState {
  constructor(size = 4, autoInit = true) {
    this.size = size;
    if (autoInit) {
      this.reset();
    } else {
      this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
      this.score = 0;
      this.isGameOver = false;
    }
  }

  reset() {
    this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
    this.score = 0;
    this.isGameOver = false;
    
    // Add two initial tiles (always 2s at start)
    this.addRandomTile(true);
    this.addRandomTile(true);
  }

  addRandomTile(isInitial = false) {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // During initialization, only add 2s. During gameplay, 10% chance of 4
      this.grid[r][c] = isInitial ? 2 : (Math.random() < 0.9 ? 2 : 4);
      return { r, c }; // Return the position of the new tile
    }
    return null;
  }

  processRow(row) {
    // Step 1: Remove zeros and get actual numbers
    let numbers = row.filter(cell => cell !== 0);
    let newRow = [];
    let merged = false;
    let mergedPositions = [];
    
    // Step 2: Merge adjacent same numbers
    for (let i = 0; i < numbers.length; i++) {
      if (i < numbers.length - 1 && numbers[i] === numbers[i + 1]) {
        // Merge tiles
        const mergedValue = numbers[i] * 2;
        newRow.push(mergedValue);
        this.score += mergedValue;
        mergedPositions.push(newRow.length - 1); // Track merged position
        i++; // Skip next number since we merged it
        merged = true;
      } else {
        newRow.push(numbers[i]);
      }
    }
    
    // Step 3: Pad with zeros to maintain grid size
    while (newRow.length < this.size) {
      newRow.push(0);
    }
    
    // Return merged positions along with the new row and change status
    return [newRow, merged || JSON.stringify(newRow) !== JSON.stringify(row), mergedPositions];
  }

  moveLeft() {
    let hasChanged = false;
    let mergedTiles = [];
    const newGrid = this.grid.map((row, rowIndex) => {
      const [newRow, changed, mergedPositions] = this.processRow(row);
      if (changed) {
        hasChanged = true;
        // Convert merged positions to grid coordinates
        mergedPositions.forEach(colIndex => {
          mergedTiles.push({ row: rowIndex, col: colIndex });
        });
      }
      return newRow;
    });
    return hasChanged ? { grid: newGrid, mergedTiles } : null;
  }

  moveRight() {
    let hasChanged = false;
    let mergedTiles = [];
    const newGrid = this.grid.map((row, rowIndex) => {
      // Reverse, process, then reverse back
      const reversed = [...row].reverse();
      const [newRow, changed, mergedPositions] = this.processRow(reversed);
      if (changed) {
        hasChanged = true;
        // Convert merged positions to grid coordinates (reverse the column index)
        mergedPositions.forEach(colIndex => {
          mergedTiles.push({ row: rowIndex, col: this.size - 1 - colIndex });
        });
      }
      return newRow.reverse();
    });
    return hasChanged ? { grid: newGrid, mergedTiles } : null;
  }

  rotateGrid(direction) {
    // Create a copy of the grid
    let newGrid = this.grid.map(row => [...row]);
    
    // For up movement: transpose
    // For down movement: transpose and reverse each row
    newGrid = newGrid[0].map((_, i) => newGrid.map(row => row[i]));
    
    if (direction === 'ArrowDown' || direction === 'Down') {
      newGrid = newGrid.map(row => [...row].reverse());
    }
    
    return newGrid;
  }

  unrotateGrid(grid, direction) {
    // For up: transpose back
    // For down: reverse each row and transpose back
    if (direction === 'ArrowDown' || direction === 'Down') {
      grid = grid.map(row => [...row].reverse());
    }
    return grid[0].map((_, i) => grid.map(row => row[i]));
  }

  hasValidMoves() {
    // Check for empty cells
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return true;
      }
    }

    // Check for possible merges horizontally
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.grid[r][c] === this.grid[r][c + 1]) return true;
      }
    }

    // Check for possible merges vertically
    for (let r = 0; r < this.size - 1; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === this.grid[r + 1][c]) return true;
      }
    }

    return false;
  }

  move(direction) {
    if (this.isGameOver) {
      return {
        moved: false,
        score: this.score,
        grid: this.grid,
        isGameOver: true
      };
    }

    let moved = false;
    let newGrid = null;
    let mergedTiles = [];

    // Store the current state for comparison
    const previousGrid = JSON.stringify(this.grid);
    const originalGrid = JSON.parse(previousGrid); // Deep copy of original grid

    switch (direction) {
      case 'ArrowLeft':
      case 'Left': {
        const result = this.moveLeft();
        if (result) {
          this.grid = result.grid;
          mergedTiles = result.mergedTiles;
          moved = true;
        }
        break;
      }

      case 'ArrowRight':
      case 'Right': {
        const result = this.moveRight();
        if (result) {
          this.grid = result.grid;
          mergedTiles = result.mergedTiles;
          moved = true;
        }
        break;
      }

      case 'ArrowUp':
      case 'Up': {
        const rotated = this.rotateGrid(direction);
        const tempGrid = rotated.map(row => [...row]); // Create a copy
        this.grid = rotated;
        const result = this.moveLeft();
        if (result) {
          const unrotated = this.unrotateGrid(result.grid, direction);
          this.grid = unrotated;
          // Convert merged tile positions
          mergedTiles = result.mergedTiles.map(({ row, col }) => ({
            row: col,
            col: row
          }));
          moved = true;
        } else {
          this.grid = originalGrid; // Restore original grid if no move
        }
        break;
      }

      case 'ArrowDown':
      case 'Down': {
        const rotated = this.rotateGrid(direction);
        const tempGrid = rotated.map(row => [...row]); // Create a copy
        this.grid = rotated;
        const result = this.moveLeft();
        if (result) {
          const unrotated = this.unrotateGrid(result.grid, direction);
          this.grid = unrotated;
          // Convert merged tile positions
          mergedTiles = result.mergedTiles.map(({ row, col }) => ({
            row: this.size - 1 - col,
            col: row
          }));
          moved = true;
        } else {
          this.grid = originalGrid; // Restore original grid if no move
        }
        break;
      }
    }

    // Only add a new tile if the grid actually changed
    if (moved && JSON.stringify(this.grid) !== previousGrid) {
      this.addRandomTile(false);
    }

    // Check if game is over
    if (!this.hasValidMoves()) {
      this.isGameOver = true;
    }

    return {
      moved,
      score: this.score,
      grid: this.grid,
      isGameOver: this.isGameOver,
      mergedTiles
    };
  }
}

export default GameState;
