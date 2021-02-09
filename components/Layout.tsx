import { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Logo = styled.h1<{ expanded?: boolean }>`
  padding: ${({ expanded }) => expanded && '15vh 0'};
  transition: padding 1s;
`;

interface Layout {
  children: React.ReactNode;
}

const Layout: React.FC<Layout> = ({ children }) => {
  const [expanded] = useState(true);
  return (
    <Wrapper>
      <Navbar />
      <Logo expanded={expanded}>FC Kluis</Logo>
      {children}
    </Wrapper>
  );
};

export default Layout;
