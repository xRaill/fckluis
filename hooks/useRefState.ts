import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

const useRefState = <S>(
  initialValue?: S
): [MutableRefObject<S>, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [stateRef, setState];
};

export default useRefState;
