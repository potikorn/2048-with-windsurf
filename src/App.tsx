import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Grid from './components/Grid/Grid';
import Score from './components/Score/Score';
import GameOver from './components/GameOver/GameOver';
import { useGameStore } from './store/gameStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 80px;
  font-weight: bold;
  margin: 0;
  color: #776e65;
`;

const Subtitle = styled.div`
  font-size: 18px;
  color: #776e65;
  margin-bottom: 30px;
`;

const GameContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const App: React.FC = () => {
  const { initializeGame, move } = useGameStore();

  useEffect(() => {
    initializeGame();

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initializeGame, move]);

  return (
    <Container>
      <Title>2048</Title>
      <Subtitle>
        Join the tiles, get to <strong>2048!</strong>
      </Subtitle>
      <Score />
      <GameContainer>
        <Grid />
        <GameOver />
      </GameContainer>
    </Container>
  );
};

export default App;
