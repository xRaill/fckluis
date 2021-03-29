import styled from 'styled-components';

const Transition = styled.div<{ transition?: boolean }>`
  opacity: ${({ transition }) => (transition ? 1 : 0)};
  transition: opacity 0.5s;
`;

interface Loading {
  active: boolean;
}

const Loading: React.FC<Loading> = ({ active, children }) => (
  <Transition transition={active}>{active && children}</Transition>
);

export default Loading;
