import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { ChangeEventHandler, useState } from 'react';
import Labels from './Labels';

const SearchWrapper = styled.label`
  display: inline-flex;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 5px;
  height: 2.5em;
  width: 40vw;
  margin: 0 auto;
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

let delayTimer;

interface Search {
  active: boolean;
  setSearch: (val: Array<string | string[]>) => void;
}

const Search: React.FC<Search> = ({ active, setSearch }) => {
  const [searching, setSearching] = useState(false);
  const [term, setTerm] = useState('');
  const [order, setOrder] = useState('desc');
  const [labels, setLabels] = useState<string[]>();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setTerm(value);
    setSearching(true);
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      setSearch([value, order, labels]);
      setSearching(false);
    }, 1000);
  };

  const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    clearTimeout(delayTimer);
    setSearching(false);
    setOrder(e.currentTarget.value);
    setSearch([term, e.currentTarget.value, labels]);
  };

  const handleLabelsChange = (labels: string[]) => {
    clearTimeout(delayTimer);
    setSearching(false);
    setLabels(labels);
    setSearch([term, order, labels]);
  };

  return (
    <>
      <SearchWrapper htmlFor={'search'}>
        <SearchIcon
          icon={searching || active ? faSpinner : faSearch}
          pulse={searching || active}
        />
        <Input
          id={'search'}
          placeholder={'Projecten zoeken...'}
          onChange={handleInputChange}
        />
        <Dropdown htmlFor={'dropdown'}>
          <select
            id={'dropdown'}
            defaultValue={order}
            onChange={handleSelectChange}
          >
            <option value={'desc'}>Nieuwste</option>
            <option value={'asc'}>Oudste</option>
          </select>
        </Dropdown>
      </SearchWrapper>
      <Labels onChange={handleLabelsChange} editable />
    </>
  );
};

export default Search;
