import { useMemo, useState } from 'react';
import useSession from './useSession';

type callback = (fn: Response) => void;

type Api = (
  path: string,
  method?: 'POST' | 'GET' | 'DELETE'
) => {
  active: boolean;
  callback: (fn: callback, mem?: unknown[]) => void;
  submit: (data?: Record<string, unknown>, bodyparser?: boolean) => void;
};

const useApi: Api = (path, method) => {
  const { accessToken } = useSession();
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState<callback>();

  const createUrlParams = (data) => {
    if (method !== 'GET') return '';
    return '?' + new URLSearchParams(data).toString();
  };

  const submit: ReturnType<Api>['submit'] = (data, multipart) => {
    setActive(true);
    setTimeout(async () => {
      const formData = new FormData();

      if (data && multipart) {
        const keys = Object.keys(data);
        await Promise.all(
          keys.map(async (k) => {
            let v: string | Blob = data[k] as string;
            if (['file'].includes(k) && v.includes('http'))
              v = await (await fetch(v as string)).blob();
            formData.append(k, v);
            Promise.resolve();
          })
        );
      }

      fetch(`/api/${path}${createUrlParams(data)}`, {
        method: method || 'POST',
        headers: accessToken ? { 'x-access-token': accessToken } : {},
        body:
          method !== 'GET'
            ? multipart
              ? formData
              : JSON.stringify(data)
            : undefined,
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
