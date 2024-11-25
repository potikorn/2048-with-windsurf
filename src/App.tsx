import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Grid from './components/Grid/Grid';
import Score from './components/Score/Score';
import GameOver from './components/GameOver/GameOver';
import GameWrapper from './components/Grid/GameWrapper';
import { useGameStore } from './store/gameStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: min(2vmin, 10px);
`;

const Header = styled.div`
  margin-bottom: min(2vmin, 10px);
  text-align: center;
`;

const Title = styled.h1`
  font-size: min(12vmin, 60px);
  font-weight: bold;
  margin: 0;
  color: #776e65;
  line-height: 1;
`;

const Subtitle = styled.div`
  font-size: min(3vmin, 16px);
  color: #776e65;
  margin-top: min(1vmin, 5px);
`;

const GameContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Footer = styled.p`
  font-size: min(2.5vmin, 14px);
  color: #776e65;
  margin-top: min(2vmin, 10px);
  text-align: center;

  a {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const App: React.FC = () => {
  const { initializeGame, move } = useGameStore();

  useEffect(() => {
    initializeGame();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initializeGame, move]);

  return (
    <GameWrapper>
      <Container>
        <Header>
          <Title>2048</Title>
          <Subtitle>Join the tiles, get to 2048!</Subtitle>
        </Header>
        <Score />
        <GameContainer>
          <Grid />
          <GameOver />
        </GameContainer>
        <Footer>
          Created by{' '}
          <a 
            href="https://codeium.com/windsurf" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Windsurf
          </a>
        </Footer>
      </Container>
    </GameWrapper>
  );
};

export default App;
