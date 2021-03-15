import { ChangeEvent, useEffect, useState } from 'react';
import { update } from 'reducers/sessionSlice';
import { useAppDispatch } from 'utils/store';
import useSession from './useSession';

type Form = (
  path: string
) => [
  loading: boolean,
  errors: Record<string, string>,
  submit: () => void,
  formLogger: (field: string) => (e: ChangeEvent<HTMLInputElement>) => void
];

const useForm: Form = (path) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        fetch(path, {
          method: 'POST',
          body: JSON.stringify({
            access_token: accessToken,
            ...data,
          }),
        })
          .finally(() => setActive(false))
          .then(async (res) => {
            const data = await res.json();
            if (data.success) {
              dispatch(update({ loggedIn: true }));
            } else {
              const newErrors = {};
              Object.values(data.errors).forEach(
                (v: Record<string, string>) => {
                  newErrors[v.field] = v.message;
                }
              );
              setErrors(newErrors);
            }
          });
      }, 500);
    }
  }, [active]);

  const formLogger = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    data[field] = e.target.value;
    setData(data);
  };

  const submit = () => {
    setErrors({});
    setActive(true);
  };

  const loading = active;

  return [loading, errors, submit, formLogger];
};

export default useForm;
