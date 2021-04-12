import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'utils/store';
import { start } from 'reducers/formSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Button = styled.button<{ active?: boolean; color?: string }>`
  border: none;
  background-color: ${({ theme, color }) =>
    theme.colors['light' + (color || 'purple')]};
  color: lightgray;
  padding: 15px 20px;
  margin: 0 auto;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  transition: background-color 0.5s;
  &:hover {
    background-color: ${({ theme, color }) => theme.colors[color || 'purple']};
  }
  & span {
    display: ${({ active }) => active && 'none'};
  }
  & svg {
    display: ${({ active }) => !active && 'none'};
  }
`;

interface FormButton {
  color?: string;
  onClick?: VoidFunction;
}

const FormButton: React.FC<FormButton> = ({ children, color, onClick }) => {
  const { active } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  return (
    <Button
      active={onClick ? false : active}
      color={color}
      onClick={onClick || (() => dispatch(start()))}
    >
      <span>{children}</span>
      <FontAwesomeIcon icon={faCircleNotch} size={'lg'} spin />
    </Button>
  );
};

export default FormButton;
