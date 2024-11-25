import React from 'react';
import styled from '@emotion/styled';
import { useGameStore } from '../../store/gameStore';

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ScoreBox = styled.div`
  position: relative;
  background: #bbada0;
  padding: 15px 25px;
  border-radius: 6px;
  color: white;
  text-align: center;
  min-width: 100px;
`;

const ScoreLabel = styled.div`
  text-transform: uppercase;
  font-size: 13px;
  margin-bottom: 5px;
`;

const ScoreValue = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const Score: React.FC = () => {
  const { score, highScore } = useGameStore();

  return (
    <ScoreContainer>
      <ScoreBox>
        <ScoreLabel>Score</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreBox>
      <ScoreBox>
        <ScoreLabel>Best</ScoreLabel>
        <ScoreValue>{highScore}</ScoreValue>
      </ScoreBox>
    </ScoreContainer>
  );
};

export default Score;
