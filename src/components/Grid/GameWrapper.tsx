import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: min(4vmin, 20px);
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Content = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
`;

interface GameWrapperProps {
  children: React.ReactNode;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ children }) => {
  return (
    <Wrapper>
      <Content>
        {children}
      </Content>
    </Wrapper>
  );
};

export default GameWrapper;
