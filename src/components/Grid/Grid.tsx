import React from 'react';
import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import Tile from './Tile';

const GRID_SIZE = 4;
const GRID_SPACING = 15;
const CELL_SIZE = 100;

const GridContainer = styled.div`
  position: relative;
  padding: ${GRID_SPACING}px;
  background: #bbada0;
  border-radius: 6px;
  width: ${CELL_SIZE * GRID_SIZE + GRID_SPACING * (GRID_SIZE + 1)}px;
  height: ${CELL_SIZE * GRID_SIZE + GRID_SPACING * (GRID_SIZE + 1)}px;
`;

const GridBackground = styled.div`
  position: absolute;
  top: ${GRID_SPACING}px;
  left: ${GRID_SPACING}px;
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);
  grid-gap: ${GRID_SPACING}px;
  z-index: 1;
`;

const Cell = styled.div`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
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

  return (
    <GridContainer>
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
