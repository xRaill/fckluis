import styled from 'styled-components';
import Link from 'next/link';
import useSession from 'hooks/useSession';

const Nav = styled.nav<{ visible: boolean }>`
  display: flex;
  border-bottom: solid 1px black;
  background-color: lightgrey;
  height: 3em;
  transition: transform 1s;
  transform: translateY(${({ visible }) => (visible ? 0 : '-100%')});
`;

const NavItem = styled.a<{ right?: boolean }>`
  line-height: 3em;
  padding: 0 1em;
  position: ${({ right }) => right && 'absolute'};
  right: ${({ right }) => right && 0};
  :hover {
    background-color: darkgrey;
  }
`;

interface Navbar {
  visible: boolean;
}

const Navbar: React.FC<Navbar> = ({ visible }) => {
  const { loggedIn } = useSession();

  return (
    <Nav visible={visible}>
      <Link href={'https://fcdeveloper.nl'} passHref>
        <NavItem>FC Developer</NavItem>
      </Link>
      {loggedIn ? (
        <Link href={'/logout'} passHref>
          <NavItem right>Logout</NavItem>
        </Link>
      ) : (
        <Link href={'/login'} passHref>
          <NavItem right>Login</NavItem>
        </Link>
      )}
    </Nav>
  );
};

export default Navbar;
