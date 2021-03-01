import styled from 'styled-components';
import Link from 'next/link';

const Nav = styled.nav`
  display: flex;
  border-bottom: solid 1px black;
  background-color: lightgrey;
  height: 3em;
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

const Navbar: React.FC = () => {
  return (
    <Nav>
      <Link href={'https://fcdeveloper.nl'} passHref>
        <NavItem>FC Developer</NavItem>
      </Link>
      <Link href={'/login'} passHref>
        <NavItem right>Login</NavItem>
      </Link>
    </Nav>
  );
};

export default Navbar;
