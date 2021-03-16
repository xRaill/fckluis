import { useEffect } from 'react';
import { update } from 'reducers/sessionSlice';
import { useAppDispatch, useAppSelector } from 'utils/store';

type Session = () => {
  loggedIn: boolean | undefined;
  accessToken: string;
  initialized: boolean;
};

const useSession: Session = () => {
  const { loggedIn, accessToken, initialized } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialized)
      fetch('/api/auth')
        .then(async (res) => {
          const body = await res.json();
          dispatch(
            update({
              initialized: true,
              loggedIn: body.success,
              accessToken: body.access_token,
            })
          );
        })
        .catch(() => dispatch(update({ initialized: true })));
  }, []);

  return { loggedIn, accessToken, initialized };
};

export default useSession;
