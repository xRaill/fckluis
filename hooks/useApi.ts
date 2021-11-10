import { useMemo, useState } from 'react';
import useSession from './useSession';

type callback = (fn: Response) => void;

type Api = (
  path: string,
  method?: 'POST' | 'GET' | 'DELETE'
) => {
  active: boolean;
  callback: (fn: callback, mem?: unknown[]) => void;
  submit: (data?: Record<string, string>, headers?: HeadersInit) => void;
};

const useApi: Api = (path, method) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState<callback>();

  const createUrlParams = (data) => {
    if (method !== 'GET') return '';
    return '?' + new URLSearchParams(data).toString();
  };

  const submit: ReturnType<Api>['submit'] = (data, headers = {}) => {
    setActive(true);
    setTimeout(async () => {
      const formData = new FormData();

      if (data) {
        const keys = Object.keys(data);
        await Promise.all(
          keys.map(async (k) => {
            let v: string | Blob = data[k];
            if (['file'].includes(k) && v.includes('http'))
              v = await (await fetch(v as string)).blob();
            formData.append(k, v);
            Promise.resolve();
          })
        );
      }

      fetch(`/api/${path}${createUrlParams(data)}`, {
        method: method || 'POST',
        headers: accessToken
          ? { 'x-access-token': accessToken, ...headers }
          : headers,
        body: method !== 'GET' ? formData : undefined,
      })
        .finally(() => setActive(false))
        .then(callback);
    }, 500);
  };

  const cb = (fn: callback, mem?: unknown[]) =>
    useMemo(() => {
      setCallback(() => fn);
    }, mem || []);

  return { active, submit, callback: cb };
};

export default useApi;
