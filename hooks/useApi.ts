import { useMemo, useState } from 'react';
import useSession from './useSession';

type callback = (fn: Response) => void;

type Api = (
  path: string,
  method?: 'POST' | 'GET'
) => {
  active: boolean;
  callback: (fn: callback) => void;
  submit: (data?: Record<string, unknown>) => void;
};

const useApi: Api = (path, method) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState<callback>();

  const submit = (data) => {
    setActive(true);
    setTimeout(() => {
      fetch(`/api/${path}`, {
        method: method || 'POST',
        headers: accessToken ? { 'x-access-token': accessToken } : {},
        body: JSON.stringify(data),
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
