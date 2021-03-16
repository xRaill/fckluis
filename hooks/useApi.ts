import { useMemo, useState } from 'react';
import useSession from './useSession';

type callback = (fn: Response) => void;

type Api = (
  path: string
) => {
  active: boolean;
  callback: (fn: callback) => void;
  submit: (data?: Record<string, unknown>) => void;
};

const useApi: Api = (path) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState<callback>();

  const submit = (data) => {
    setActive(true);
    setTimeout(() => {
      fetch(`/api/${path}`, {
        method: 'POST',
        body: JSON.stringify({
          access_token: accessToken,
          ...data,
        }),
      })
        .finally(() => setActive(false))
        .then(callback);
    }, 1000);
  };

  const cb = (fn: callback) =>
    useMemo(() => {
      setCallback(() => fn);
    }, []);

  return { active, submit, callback: cb };
};

export default useApi;
