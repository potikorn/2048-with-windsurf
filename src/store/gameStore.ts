import { create } from 'zustand';

type Position = {
  row: number;
  col: number;
};

type Tile = {
  id: number;
  value: number;
  position: Position;
  mergedFrom?: Tile[];
  isNew?: boolean;
};

interface GameState {
  grid: number[][];
  score: number;
  highScore: number;
  isGameOver: boolean;
  tiles: Tile[];
  tileIdCounter: number;
  initializeGame: () => void;
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  updateHighScore: (score: number) => void;
  resetGame: () => void;
}

const GRID_SIZE = 4;
const createInitialGrid = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

const getRandomPosition = (grid: number[][]) => {
  const availablePositions: Position[] = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        availablePositions.push({ row: i, col: j });
      }
    });
  });
  
  if (availablePositions.length === 0) return null;
  return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};

const buildTraversals = (direction: 'up' | 'down' | 'left' | 'right') => {
  const traversals = {
    x: Array.from({ length: GRID_SIZE }, (_, i) => i),
    y: Array.from({ length: GRID_SIZE }, (_, i) => i)
  };

  if (direction === 'right') traversals.x.reverse();
  if (direction === 'down') traversals.y.reverse();

  return traversals;
};

const findFarthestPosition = (
  grid: number[][],
  pos: Position,
  vector: [number, number]
): { farthest: Position; next: Position | null } => {
  let previous: Position;
  let cell = { row: pos.row, col: pos.col };

  do {
    previous = { ...cell };
    cell = {
      row: previous.row + vector[0],
      col: previous.col + vector[1]
    };
  } while (
    cell.row >= 0 &&
    cell.row < GRID_SIZE &&
    cell.col >= 0 &&
    cell.col < GRID_SIZE &&
    grid[cell.row][cell.col] === 0
  );

  return {
    farthest: previous,
    next: (
      cell.row >= 0 &&
      cell.row < GRID_SIZE &&
      cell.col >= 0 &&
      cell.col < GRID_SIZE
    ) ? cell : null
  };
};

const getVector = (direction: 'up' | 'down' | 'left' | 'right'): [number, number] => {
  switch (direction) {
    case 'up': return [-1, 0];
    case 'right': return [0, 1];
    case 'down': return [1, 0];
    case 'left': return [0, -1];
  }
};

const positionsEqual = (pos1: Position, pos2: Position) => 
  pos1.row === pos2.row && pos1.col === pos2.col;

export const useGameStore = create<GameState>((set, get) => ({
  grid: createInitialGrid(),
  score: 0,
  highScore: parseInt(localStorage.getItem('highScore') || '0', 10),
  isGameOver: false,
  tiles: [],
  tileIdCounter: 0,

  initializeGame: () => {
    const grid = createInitialGrid();
    const tiles: Tile[] = [];
    let tileIdCounter = 0;

    for (let i = 0; i < 2; i++) {
      const position = getRandomPosition(grid);
      if (position) {
        const value = Math.random() < 0.9 ? 2 : 4;
        grid[position.row][position.col] = value;
        tiles.push({
          id: tileIdCounter++,
          value,
          position,
          isNew: true
        });
      }
    }

    set({
      grid,
      tiles,
      tileIdCounter,
      score: 0,
      isGameOver: false
    });
  },

  resetGame: () => {
    get().initializeGame();
  },

  move: (direction) => {
    const { grid, score: currentScore, tileIdCounter: currentTileId } = get();
    let moved = false;
    let newScore = currentScore;
    let tileIdCounter = currentTileId;

    const newGrid = grid.map(row => [...row]);
    const newTiles: Tile[] = [];
    const vector = getVector(direction);
    const traversals = buildTraversals(direction);

    const cellContent: { [key: string]: number } = {};
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col] !== 0) {
          cellContent[`${row},${col}`] = newGrid[row][col];
          newGrid[row][col] = 0;
        }
      }
    }

    traversals.y.forEach(row => {
      traversals.x.forEach(col => {
        const originalPos = { row, col };
        const value = cellContent[`${row},${col}`];

        if (value) {
          const { farthest, next } = findFarthestPosition(newGrid, originalPos, vector);
          
          if (!positionsEqual(originalPos, farthest) || 
              (next && newGrid[next.row][next.col] === value)) {
            moved = true;
          }

          if (next && newGrid[next.row][next.col] === value) {
            const mergedValue = value * 2;
            newGrid[next.row][next.col] = mergedValue;
            newScore += mergedValue;
            
            newTiles.push({
              id: tileIdCounter++,
              value: mergedValue,
              position: next,
              mergedFrom: [
                { id: -1, value, position: originalPos },
                { id: -1, value, position: next }
              ]
            });
          } else {
            newGrid[farthest.row][farthest.col] = value;
            newTiles.push({
              id: tileIdCounter++,
              value,
              position: farthest
            });
          }
        }
      });
    });

    if (moved) {
      const position = getRandomPosition(newGrid);
      if (position) {
        const value = Math.random() < 0.9 ? 2 : 4;
        newGrid[position.row][position.col] = value;
        newTiles.push({
          id: tileIdCounter++,
          value,
          position,
          isNew: true
        });
      }

      get().updateHighScore(newScore);
      const isGameOver = !getRandomPosition(newGrid) && !canMove(newGrid);

      set({
        grid: newGrid,
        tiles: newTiles,
        score: newScore,
        tileIdCounter,
        isGameOver
      });
    }
  },

  updateHighScore: (score) => {
    if (score > get().highScore) {
      set({ highScore: score });
      localStorage.setItem('highScore', score.toString());
    }
  }
}));

function canMove(grid: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) return true;
      
      const value = grid[row][col];
      const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1]
      ];

      for (const [r, c] of neighbors) {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
          if (grid[r][c] === value) return true;
        }
      }
    }
  }
  return false;
}
