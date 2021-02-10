import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useState,
} from 'react';
import styled from 'styled-components';

const LabelsContainer = styled.div`
  max-width: 40vw;
  margin: 0 auto;
`;

const LabelWrapper = styled.span`
  display: inline-flex;
  margin: 0 5px;
  & span {
    background-color: ${({ theme }) => theme.colors.lightpurple};
    padding: 2px 5px 2px;
    font-size: 0.8em;
  }
`;

const LabelText = styled.span<{ single: boolean }>`
  color: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  ${({ single }) =>
    single && {
      borderTopRightRadius: '5px',
      borderBottomRightRadius: '5px',
    }}
`;

const RemoveLabel = styled.span`
  border-left: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
    cursor: pointer;
  }
`;

const AddLabel = styled.span<{ active: boolean }>`
  display: inline-block;
  border: ${({ active }) => `1px ${active ? 'solid' : 'none'} gray`};
  border-radius: 5px;
  padding: 0 5px;
  font-size: 0.8em;
  color: gray;
  &:hover,
  &:focus {
    cursor: pointer;
  }
  & input {
    border: ${({ active }) => `1px ${active ? 'none' : 'dashed'} gray`};
    margin: 0 2px;
    width: 110px;
    outline: none;
    border-radius: 5px;
    background-color: transparent;
  }
  & div {
    display: ${({ active }) => (active ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    background-color: #fff;
    border: 1px solid gray;
    & span {
      display: block;
      width: 110px;
      text-align: left;
      padding: 2px 5px;
      &:hover {
        background-color: #eff;
      }
      &.selected {
        background-color: #dff;
      }
    }
  }
`;

interface Labels {
  content?: string[];
  editable?: boolean;
}

const Labels: React.FC<Labels> = ({ editable, content = [] }) => {
  const [labels, setLabels] = useState(content);
  const [dropdown, setDropdown] = useState(false);
  const [index, setIndex] = useState(0);
  const [term, setTerm] = useState('');

  const removeLabel = (name: string) =>
    setLabels(labels.filter((v) => v !== name));

  const addLabel = (name: string) => {
    setLabels(labels.concat(name));
    setTerm('');
    setIndex(0);
  };

  const filteredLabels = () =>
    allLabels.filter(
      (name) => !labels.includes(name) && name.toLowerCase().includes(term)
    );

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) =>
    setTerm(e.currentTarget.value.toLowerCase() || '');

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case 'Enter':
        addLabel(filteredLabels()[index]);
        break;
      case 'ArrowDown':
        index < filteredLabels().length - 1 && setIndex(index + 1);
        break;
      case 'ArrowUp':
        index > 0 && setIndex(index - 1);
        break;
    }
  };

  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => {
    setDropdown(true);
    document.getElementById('label-search').focus();
  };

  const allLabels = ['Label1', 'Label2', 'Label3', 'Label4'];

  return (
    <LabelsContainer>
      {labels.map((label, i) => (
        <LabelWrapper key={i}>
          <LabelText single={!editable}>{label}</LabelText>
          {editable && (
            <RemoveLabel onClick={() => removeLabel(label)}>
              <FontAwesomeIcon icon={faTimes} />
            </RemoveLabel>
          )}
        </LabelWrapper>
      ))}
      <AddLabel
        active={dropdown}
        onFocus={handleFocus}
        onBlur={() => setDropdown(false)}
        tabIndex={0}
      >
        <input
          id={'label-search'}
          placeholder={'Label toevoegen'}
          value={term}
          onChange={handleSearch}
          onKeyDown={handleKeyPress}
        />
        <div>
          {filteredLabels().map((name, i) => (
            <span
              key={i}
              className={index === i && 'selected'}
              onClick={() => addLabel(name)}
              children={name}
            />
          ))}
        </div>
      </AddLabel>
    </LabelsContainer>
  );
};

export default Labels;
