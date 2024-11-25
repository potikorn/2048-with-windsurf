import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { type Tile as TileType } from '../../store/gameStore';

interface TileProps {
  tile: TileType;
  gridSize: number;
  spacing: string | number;
  size: string;
}

const tileColors: Record<number, { background: string; text: string }> = {
  2: { background: '#eee4da', text: '#776e65' },
  4: { background: '#ede0c8', text: '#776e65' },
  8: { background: '#f2b179', text: '#f9f6f2' },
  16: { background: '#f59563', text: '#f9f6f2' },
  32: { background: '#f67c5f', text: '#f9f6f2' },
  64: { background: '#f65e3b', text: '#f9f6f2' },
  128: { background: '#edcf72', text: '#f9f6f2' },
  256: { background: '#edcc61', text: '#f9f6f2' },
  512: { background: '#edc850', text: '#f9f6f2' },
  1024: { background: '#edc53f', text: '#f9f6f2' },
  2048: { background: '#edc22e', text: '#f9f6f2' }
};

const StyledTile = styled(motion.div)<{ $value: number; $size: string }>`
  position: absolute;
  width: ${props => props.$size};
  height: ${props => props.$size};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ $value }) => 
    $value < 100 
      ? 'min(10vmin, 50px)' 
      : $value < 1000 
        ? 'min(8vmin, 40px)' 
        : 'min(6vmin, 30px)'
  };
  font-weight: bold;
  border-radius: 3px;
  background-color: ${({ $value }) => tileColors[$value]?.background || '#3c3a32'};
  color: ${({ $value }) => tileColors[$value]?.text || '#f9f6f2'};
  user-select: none;
  transform-origin: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tile: React.FC<TileProps> = ({ tile, spacing, size }) => {
  const x = `calc(${tile.position.col} * (${size} + ${spacing}) + ${spacing})`;
  const y = `calc(${tile.position.row} * (${size} + ${spacing}) + ${spacing})`;

  return (
    <StyledTile
      $value={tile.value}
      $size={size}
      initial={tile.isNew ? { 
        scale: 0,
        x,
        y
      } : { 
        scale: tile.mergedFrom ? 1.2 : 1,
        x,
        y
      }}
      animate={{
        scale: 1,
        x,
        y
      }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 200, damping: 20 }
      }}
    >
      {tile.value}
    </StyledTile>
  );
};

export default Tile;
