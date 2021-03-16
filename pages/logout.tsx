import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useApi from 'hooks/useApi';
import { useEffect } from 'react';
import { useAppDispatch } from 'utils/store';
import { update } from 'reducers/sessionSlice';

const Logout: React.FC = () => {
  const { submit, callback } = useApi('logout');
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  callback(async (res) => {
    const body = await res.json();
    if (body.success) {
      dispatch(update({ loggedIn: false, accessToken: '' }));

      push('/');

      toast({ type: 'success', message: 'Logged out!' });
    }
  });

  useEffect(() => {
    dispatch(update({ initialized: false }));
    setTimeout(() => submit(), 1000);
  }, []);

  return <Layout>{}</Layout>;
};

export default Logout;
