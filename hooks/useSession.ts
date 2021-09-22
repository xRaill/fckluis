import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { update } from 'reducers/sessionSlice';
import { useAppDispatch, useAppSelector } from 'utils/store';

type Session = () => {
  loggedIn: boolean | undefined;
  accessToken: string;
  initialized: boolean;
  authenticate: (fn?: (loggedIn?: boolean) => void) => void;
  admin: boolean;
};

let api = true;

const useSession: Session = () => {
  const { loggedIn, accessToken, initialized, admin } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  useEffect(() => {
    if (!initialized && api) {
      api = false;
      fetch('/api/auth')
        .then(async (res) => {
          const body = await res.json();
          dispatch(
            update({
              initialized: true,
              loggedIn: body.success,
              accessToken: body.access_token,
              admin: body.admin,
            })
          );
        })
        .catch(() => dispatch(update({ initialized: true })));
    }
  }, []);

  const authenticate = (fn?: (loggedIn?: boolean) => void) => {
    useEffect(() => {
      if (initialized) {
        if (!loggedIn) push('/');
        fn && fn(loggedIn);
      }
    }, [initialized]);
  };

  return { loggedIn, accessToken, initialized, authenticate, admin };
};

export default useSession;
