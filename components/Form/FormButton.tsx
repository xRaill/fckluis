import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'utils/store';
import { start } from 'reducers/formSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Button = styled.button<{ active?: boolean }>`
  border: none;
  background-color: ${({ theme }) => theme.colors.lightpurple};
  color: lightgray;
  padding: 15px 20px;
  margin: 0 auto;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  transition: background-color 0.5s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
  }
  & span {
    display: ${({ active }) => active && 'none'};
  }
  & svg {
    display: ${({ active }) => !active && 'none'};
  }
`;

const FormButton: React.FC = ({ children }) => {
  const { active } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  return (
    <Button active={active} onClick={() => dispatch(start())}>
      <span>{children}</span>
      <FontAwesomeIcon icon={faCircleNotch} size={'lg'} spin />
    </Button>
  );
};

export default FormButton;
