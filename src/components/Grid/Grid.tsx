import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import Tile from './Tile';

const GRID_SIZE = 4;
const GRID_SPACING = 'min(1.5vmin, 8px)';
const CELL_SIZE = 'min(18vmin, 90px)';

const GridContainer = styled.div`
  position: relative;
  padding: ${GRID_SPACING};
  background: #bbada0;
  border-radius: 6px;
  width: calc(${CELL_SIZE} * ${GRID_SIZE} + ${GRID_SPACING} * (${GRID_SIZE} + 1));
  height: calc(${CELL_SIZE} * ${GRID_SIZE} + ${GRID_SPACING} * (${GRID_SIZE} + 1));
  touch-action: none;
  user-select: none;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GridBackground = styled.div`
  position: absolute;
  top: ${GRID_SPACING};
  left: ${GRID_SPACING};
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE});
  grid-gap: ${GRID_SPACING};
  z-index: 1;
`;

const Cell = styled.div`
  width: ${CELL_SIZE};
  height: ${CELL_SIZE};
  background: rgba(238, 228, 218, 0.35);
  border-radius: 3px;
`;

const TileContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
`;

const Grid: React.FC = () => {
  const tiles = useGameStore(state => state.tiles);
  const move = useGameStore(state => state.move);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            move('right');
          } else {
            move('left');
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            move('down');
          } else {
            move('up');
          }
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  }, [move]);

  return (
    <GridContainer onTouchStart={handleTouchStart}>
      <GridBackground>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <Cell key={index} />
        ))}
      </GridBackground>
      <TileContainer>
        <AnimatePresence mode="popLayout">
          {tiles.map(tile => (
            <Tile
              key={tile.id}
              tile={tile}
              gridSize={GRID_SIZE}
              spacing={GRID_SPACING}
              size={CELL_SIZE}
            />
          ))}
        </AnimatePresence>
      </TileContainer>
    </GridContainer>
  );
};

export default Grid;
