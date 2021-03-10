import {
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { keyframes } from 'styled-components';
import { useAppSelector } from 'utils/store';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 15px;
  pointer-events: none;
`;

const showToast = keyframes`
  0% { height: 0; }
  10% { height: 50px; margin: 10px 0; transform: translateY(0); }
  90% { height: 50px; margin: 10px 0; transform: translateY(0); }
  100% { height: 50px; margin: 10px 0; transform: translateX(-400px); }
`;

const Toast = styled.div<{ color: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 0px;
  background-color: ${({ color }) => color};
  margin: 0;
  overflow: hidden;
  transform: translateY(150px);
  animation: ${showToast} 10s;
  & > svg {
    margin: 0 10px;
  }
  & > span {
    text-align: center;
    width: 100%;
    padding: 5px 0;
  }
`;

enum color {
  success = 'green',
  danger = 'red',
}

const icon = {
  success: faCheck,
  danger: faExclamationTriangle,
};

export const Toasts: React.FC = () => {
  const { toasts } = useAppSelector((state) => state.toast);

  return (
    <Wrapper>
      {toasts.map((toast, i) => (
        <Toast key={i} color={color[toast.type]}>
          <FontAwesomeIcon size={'2x'} icon={icon[toast.type]} />
          <span>{toast.message}</span>
        </Toast>
      ))}
    </Wrapper>
  );
};
