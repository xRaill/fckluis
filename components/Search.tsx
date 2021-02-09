import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useState } from 'react';

const SearchWrapper = styled.label`
  display: inline-flex;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 5px;
  height: 2.5em;
  width: 40vw;
  @media (max-width: 767px) {
    width: 90vw;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.colors.purple};
  margin: 10px 7px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 1em;
  width: 100%;
  padding: 7px 0;
  ::placeholder {
    color: gray;
  }
`;

const Dropdown = styled.label`
  display: inline-flex;
  border-left: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  height: 100%;
  & select {
    appearance: none;
    outline: none;
    border: none;
    background-color: transparent;
    padding-left: 6px;
    padding-right: 15px;
    & option {
      background-color: #fff;
      border-radius: 5px;
    }
    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  &:after {
    display: flex;
    flex-direction: row-reverse;
    align-self: center;
    width: 75px;
    font-size: 0.7em;
    position: absolute;
    pointer-events: none;
    content: '▼';
  }
`;

const Search: React.FC = () => {
  const [searching, setSearching] = useState(false);

  return (
    <div>
      <SearchWrapper htmlFor={'search'}>
        <SearchIcon icon={searching ? faSpinner : faSearch} pulse={searching} />
        <Input id={'search'} placeholder={'Projecten zoeken...'} />
        <Dropdown htmlFor={'dropdown'}>
          <select id={'dropdown'}>
            <option>Nieuwste</option>
            <option>Oudste</option>
          </select>
        </Dropdown>
      </SearchWrapper>
    </div>
  );
};

export default Search;
