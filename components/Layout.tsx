import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from 'components/Navbar';
import { Toasts } from './Toasts';
import useSession from 'hooks/useSession';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import usePageTransition from 'hooks/usePageTransition';

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
  transition: opacity 0.5s;
`;

const ScrollBar = styled(SimpleBar)`
  height: 94vh;
`;

interface Layout {
  children: React.ReactNode;
}

const Layout: React.FC<Layout> = ({ children }) => {
  const { initialized } = useSession();
  const [expanded, setExpanded] = useState(!initialized);
  const { TransitionComponent, state } = usePageTransition(children);

  useEffect(() => {
    if (initialized) setExpanded(false);
  }, [initialized]);

  return (
    <Wrapper>
      <Navbar visible={!expanded} />
      <ScrollBar>
        <Logo expanded={expanded}>
          <Link href={'/'}>FC Kluis</Link>
        </Logo>
        {state !== 2 && (
          <Body transition={state === 0}>
            {!expanded && TransitionComponent}
          </Body>
        )}
        <Body transition={!expanded && state === 2}>
          {!expanded && children}
        </Body>
      </ScrollBar>
      <Toasts />
    </Wrapper>
  );
};

export default Layout;
