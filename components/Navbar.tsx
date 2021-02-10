import styled from 'styled-components';

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
      <NavItem href={'https://fcdeveloper.nl'}>FC Developer</NavItem>
      <NavItem right>Login</NavItem>
      {/* Test */}
    </Nav>
  );
};

export default Navbar;
