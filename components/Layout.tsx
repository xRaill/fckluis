import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from 'components/Navbar';
import { Toasts } from './Toasts';
import useSession from 'hooks/useSession';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Logo = styled.h1<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ expanded }) => (expanded ? '80vh' : '30vh')};
  transition: height 1s;
`;

const Body = styled.div<{ transition?: boolean }>`
  opacity: ${({ transition }) => (transition ? 1 : 0)};
  transition: opacity 1s;
`;

interface Layout {
  children: React.ReactNode;
}

const Layout: React.FC<Layout> = ({ children }) => {
  const { initialized } = useSession();
  const [expanded, setExpanded] = useState(!initialized);

  useEffect(() => {
    if (initialized) setExpanded(false);
  }, [initialized]);

  return (
    <Wrapper>
      <Navbar visible={!expanded} />
      <Logo expanded={expanded}>
        <Link href={'/'}>FC Kluis</Link>
      </Logo>
      <Body transition={!expanded}>{!expanded && children}</Body>
      <Toasts />
    </Wrapper>
  );
};

export default Layout;
