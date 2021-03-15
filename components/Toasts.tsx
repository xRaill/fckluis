import {
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toast as ToastType } from 'reducers/toastSlice';
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
  from { height: 0; margin: 0 }
  to { height: 50px; margin: 10px 0; transform: translateY(0); }
`;

const hideToast = keyframes`
  from { transform: translateY(0); }
  to { transform: translateX(-400px); }
`;

const animationStates = {
  entering: showToast,
  entered: '',
  exiting: hideToast,
};

const Toast = styled.div<{ color: string; state: ToastType['state'] }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 50px;
  background-color: ${({ color }) => color};
  margin: 10px 0;
  overflow: hidden;
  animation-name: ${({ state }) => animationStates[state]};
  animation-duration: 1s;
  animation-fill-mode: forwards;
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
        <Toast key={i} color={color[toast.type]} state={toast.state}>
          <FontAwesomeIcon size={'2x'} icon={icon[toast.type]} />
          <span>{toast.message}</span>
        </Toast>
      ))}
    </Wrapper>
  );
};
