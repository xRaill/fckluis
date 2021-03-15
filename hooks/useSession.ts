import { useEffect } from 'react';
import { update } from 'reducers/sessionSlice';
import { useAppDispatch, useAppSelector } from 'utils/store';

type Session = () => {
  loggedIn: boolean | undefined;
  accessToken: string;
  intialized: boolean;
};

const useSession: Session = () => {
  const { loggedIn, accessToken, initialized } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loggedIn === undefined)
      fetch('/api/auth')
        .then(async (res) => {
          const body = await res.json();
          dispatch(
            update({
              loggedIn: body.success,
              accessToken: body.access_token,
            })
          );
        })
        .catch(() => update({ loggedIn: false }));
  }, []);

  return { loggedIn, accessToken, initialized };
};

export default useSession;
