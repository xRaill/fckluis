import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useApi from 'hooks/useApi';
import { useAppDispatch } from 'utils/store';
import { update } from 'reducers/sessionSlice';
import useSession from 'hooks/useSession';

const Logout: React.FC = () => {
  const { submit, callback } = useApi('logout');
  const { authenticate } = useSession();
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  callback(async (res) => {
    const body = await res.json();
    if (body.success) {
      dispatch(update({ loggedIn: false, accessToken: '', initialize: false }));
      push('/');
      toast({ type: 'success', message: 'Logged out!' });
    }
  });

  authenticate((loggedIn) => {
    if (loggedIn) setTimeout(() => submit(), 1000);
    else push('/');
  });

  return <Layout>{}</Layout>;
};

export default Logout;
