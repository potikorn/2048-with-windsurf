import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(238, 228, 218, 0.73);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 6px;
`;

const Message = styled.h1`
  font-size: 60px;
  font-weight: bold;
  color: #776e65;
  margin-bottom: 30px;
`;

const RetryButton = styled.button`
  background: #8f7a66;
  border-radius: 3px;
  padding: 0 20px;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  
  &:hover {
    background: #9f8a76;
  }
`;

const GameOver: React.FC = () => {
  const { isGameOver, resetGame } = useGameStore();

  return (
    <AnimatePresence>
      {isGameOver && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Message>Game Over!</Message>
          <RetryButton onClick={resetGame}>
            Try again
          </RetryButton>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default GameOver;
