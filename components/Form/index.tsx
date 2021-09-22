import useApi from 'hooks/useApi';
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

  useEffect(() => {
    return () => dispatch(reset());
  }, []);

  callback(async (res) => {
    const body = await res.json();

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
