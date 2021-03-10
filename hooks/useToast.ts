import { Toast } from 'components/ToastProvider';
import { add, pop } from 'reducers/toastSlice';
import { useAppDispatch } from 'utils/store';

type useToast = () => (toast: Toast) => void;

const useToast: useToast = () => {
  const dispatch = useAppDispatch();

  const addToast = (toast: Toast) => {
    dispatch(add(toast));
    setTimeout(() => {
      dispatch(pop());
    }, 15000);
  };

  return addToast;
};

export default useToast;
