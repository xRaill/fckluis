import { useEffect } from 'react';
import { useGlobalState } from './useGlobalState';

type Session = () => [loggedIn: boolean | undefined, accessToken: string];

const useSession: Session = () => {
  const [loggedIn, setLoggedIn] = useGlobalState('loggedIn');
  const [accessToken, setAccessToken] = useGlobalState('accessToken');

  useEffect(() => {
    if (loggedIn === undefined)
      fetch('/api/auth')
        .then(async (res) => {
          const body = await res.json();
          setLoggedIn(body.success);
          setAccessToken(body.access_token);
        })
        .catch(() => setLoggedIn(false));
  }, []);

  return [loggedIn, accessToken];
};

export default useSession;
