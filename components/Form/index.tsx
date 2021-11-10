import useApi from 'hooks/useApi';
import useToast from 'hooks/useToast';
import { useEffect } from 'react';
import { addError, reset, stop } from 'reducers/formSlice';
import { useAppDispatch, useAppSelector } from 'utils/store';
import FormError from './FormError';

interface Form {
  path: string;
  onSuccess?: (res: Record<string, unknown>) => void;
}

const Form: React.FC<Form> = ({ path, onSuccess, children }) => {
  const { active, data } = useAppSelector((state) => state.form);
  const { submit, callback } = useApi(path, 'POST');
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  callback(async (res) => {
    let body;
    try {
      body = await res.json();
    } catch {
      toast({ type: 'danger', message: 'Something went wrong!' });
      return dispatch(stop());
    }

    if (body.success) {
      onSuccess && onSuccess(body);
    } else {
      body.errors.forEach((error) => {
        dispatch(addError(error));
      });
    }
    dispatch(stop());
  });

  useEffect(() => {
    if (active) {
      const apiData = {};
      data.forEach((a) => (apiData[a.field] = a.value));
      submit(apiData);
    }
  }, [active]);

  return (
    <div className={'form'}>
      <FormError field={'base'} />
      {children}
    </div>
  );
};

export default Form;
