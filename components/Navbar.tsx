import styled from 'styled-components';
import Link from 'next/link';
import useSession from 'hooks/useSession';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const NavBtn = styled.div<{ open: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 3.1em;
  width: 4em;
  background-color: lightgrey;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  z-index: 2;
  border-bottom: ${({ open }) => `solid 1px ${open ? 'lightgray' : 'black'}`};
  border-right: ${({ open }) => `solid 1px ${open ? 'lightgray' : 'black'}`};
  transition: border 0.5s;
  @media (min-width: 767px) {
    display: none;
  }
`;

const Nav = styled.nav<{ visible: boolean; open: boolean }>`
  display: flex;
  justify-content: end;
  border-bottom: solid 1px black;
  background-color: lightgrey;
  height: 3.1em;
  width: 100vw;
  transition: transform 0.5s, opacity 0.5s;
  transform: ${({ visible }) => `translateY(${visible ? 0 : '-100%'})`};
  @media (max-width: 767px) {
    position: fixed;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    transform: ${({ visible, open }) =>
      `translateY(${visible ? 0 : '-100%'}) translateX(${open ? 0 : '-100%'})`};
    opacity: ${({ open }) => (open ? 1 : 0)};
    z-index: 1;
  }
`;

const NavItem = styled.a<{ left?: boolean }>`
  line-height: 3em;
  padding: 0 1em;
  :hover {
    background-color: darkgrey;
  }
  @media (min-width: 767px) {
    margin-right: ${({ left }) => left && 'auto'};
  }
`;

const MenuItems = [
  {
    href: 'https://fcdeveloper.nl',
    name: 'FC Developer',
    left: true,
  },
  {
    href: '/login',
    name: 'Login',
    loggedIn: false,
  },
  {
    href: '/projects/new',
    name: 'New Project',
    loggedIn: true,
  },
  {
    href: '/users',
    name: 'Users',
    loggedIn: true,
    admin: true,
  },
  {
    href: '/logout',
    name: 'Logout',
    loggedIn: true,
  },
];

interface Navbar {
  visible: boolean;
}

const Navbar: React.FC<Navbar> = ({ visible }) => {
  const [menu, setMenu] = useState(false);
  const { loggedIn, admin } = useSession();

  return (
    <>
      <NavBtn open={menu} onClick={() => setMenu(!menu)}>
        <FontAwesomeIcon icon={menu ? faTimes : faBars} size={'2x'} />
      </NavBtn>
      <Nav visible={visible} open={menu}>
        {MenuItems.map(
          (item, i) =>
            (item.loggedIn === loggedIn ||
              typeof item.loggedIn === 'undefined') &&
            (item.admin == admin || typeof item.admin === 'undefined') && (
              <Link key={i} href={item.href} passHref>
                <NavItem left={item.left} onClick={() => setMenu(false)}>
                  {item.name}
                </NavItem>
              </Link>
            )
        )}
      </Nav>
    </>
  );
};

export default Navbar;
