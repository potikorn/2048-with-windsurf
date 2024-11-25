import React from 'react';
import styled from '@emotion/styled';
import { useGameStore } from '../../store/gameStore';

// Constants to match Grid.tsx
const GRID_SIZE = 4;
const GRID_SPACING = 'min(1.5vmin, 8px)';
const CELL_SIZE = 'min(18vmin, 90px)';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(${CELL_SIZE} * ${GRID_SIZE} + ${GRID_SPACING} * (${GRID_SIZE} + 1));
  margin: 0 auto min(2vmin, 10px);
`;

const ScoresSection = styled.div`
  display: flex;
  gap: min(1.5vmin, 8px);
`;

const ScoreBox = styled.div`
  background: #bbada0;
  padding: min(1.5vmin, 8px) min(2vmin, 10px);
  border-radius: 6px;
  color: white;
  text-align: center;
  flex: 1;
  min-width: min(16vmin, 80px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScoreLabel = styled.div`
  text-transform: uppercase;
  font-size: min(2.2vmin, 11px);
  margin-bottom: min(0.8vmin, 4px);
`;

const ScoreValue = styled.div`
  font-size: min(4vmin, 20px);
  font-weight: bold;
`;

const NewGameButton = styled.button`
  background: #8f7a66;
  color: white;
  border: none;
  border-radius: 6px;
  padding: min(1.5vmin, 8px) min(3vmin, 15px);
  font-size: min(2.8vmin, 14px);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #7f6a56;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Score: React.FC = () => {
  const { score, highScore, resetGame } = useGameStore();

  return (
    <HeaderContainer>
      <ScoresSection>
        <ScoreBox>
          <ScoreLabel>Score</ScoreLabel>
          <ScoreValue>{score}</ScoreValue>
        </ScoreBox>
        <ScoreBox>
          <ScoreLabel>Best</ScoreLabel>
          <ScoreValue>{highScore}</ScoreValue>
        </ScoreBox>
      </ScoresSection>
      <NewGameButton onClick={resetGame}>
        New Game
      </NewGameButton>
    </HeaderContainer>
  );
};

export default Score;
