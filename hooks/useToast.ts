import { add, entered, exiting, pop, Toast } from 'reducers/toastSlice';
import { useAppDispatch } from 'utils/store';

type useToast = () => (toast: Toast) => void;

const useToast: useToast = () => {
  const dispatch = useAppDispatch();

  const addToast = (toast: Toast) => {
    dispatch(add(Object.assign(toast, { state: 'entering' })));
    setTimeout(() => dispatch(entered()), 1000);
    setTimeout(() => {
      dispatch(exiting());
      setTimeout(() => dispatch(pop()), 2000);
    }, 8500);
  };

  return addToast;
};

export default useToast;
