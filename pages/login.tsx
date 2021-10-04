import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import { useEffect } from 'react';
import { update } from 'reducers/sessionSlice';
import { useAppDispatch } from 'utils/store';
import FormCheckbox from 'components/Form/FormCheckbox';

const Home: React.FC = () => {
  const { loggedIn } = useSession();
  const { push } = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loggedIn) push('/');
  }, [loggedIn]);

  const handleSuccess = (body) => {
    dispatch(
      update({
        loggedIn: true,
        accessToken: body.access_token,
        admin: body.admin,
      })
    );
    push('/');
    toast({ type: 'success', message: 'Logged in!' });
  };

  return (
    <Layout>
      {!loggedIn && (
        <Form path={'login'} onSuccess={handleSuccess}>
          <FormField name={'email'} placeholder={'email@example.com'} />
          <FormField
            name={'password'}
            type={'password'}
            placeholder={'******'}
          />
          <FormCheckbox title={'Remember me'} name={'remember_me'} />
          <FormButton>Login</FormButton>
          <br />
          <Link href={'/password_forget'}>Forgot password?</Link>
        </Form>
      )}
    </Layout>
  );
};

export default Home;
