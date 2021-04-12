import { useMemo, useState } from 'react';
import useSession from './useSession';

type callback = (fn: Response) => void;

type Api = (
  path: string,
  method?: 'POST' | 'GET' | 'DELETE'
) => {
  active: boolean;
  callback: (fn: callback) => void;
  submit: (data?: Record<string, unknown>) => void;
};

const useApi: Api = (path, method) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState<callback>();

  const createUrlParams = (data) => {
    if (method !== 'GET') return '';
    return '?' + new URLSearchParams(data).toString();
  };

  const submit = (data) => {
    setActive(true);
    setTimeout(() => {
      fetch(`/api/${path}${createUrlParams(data)}`, {
        method: method || 'POST',
        headers: accessToken ? { 'x-access-token': accessToken } : {},
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
      })
        .finally(() => setActive(false))
        .then(callback);
    }, 500);
  };

  const cb = (fn: callback) =>
    useMemo(() => {
      setCallback(() => fn);
    }, []);

  return { active, submit, callback: cb };
};

export default useApi;
