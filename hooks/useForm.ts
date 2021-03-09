import { ChangeEvent, useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

type Form = (
  path: string
) => [
  loading: boolean,
  errors: Record<string, string>,
  submit: () => void,
  formLogger: (field: string) => (e: ChangeEvent<HTMLInputElement>) => void
];

const useForm: Form = (path) => {
  const [accessToken] = useGlobalState('accessToken');
  const [_, setLoggedIn] = useGlobalState('loggedIn');
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});

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
              setLoggedIn(true);
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
