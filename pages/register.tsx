import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import { useEffect } from 'react';
import Head from 'next/head';

const Register: React.FC = () => {
  const { loggedIn } = useSession();
  const { push, query } = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (loggedIn) {
      push('/');
      toast({ type: 'danger', message: 'Logout before creating an account' });
    }
  }, [loggedIn]);

  const handleSuccess = () => {
    push('/login');
    toast({ type: 'success', message: 'Account created!' });
  };

  return (
    <Layout>
      <Head>
        <title>FC Kluis - Register</title>
      </Head>
      {!loggedIn && (
        <Form path={'register'} onSuccess={handleSuccess}>
          <FormField
            name={'password'}
            type={'password'}
            placeholder={'******'}
          />
          <FormField
            title={'Confirm password'}
            name={'password_verify'}
            type={'password'}
            placeholder={'******'}
          />
          <FormField
            name={'token'}
            type={'hidden'}
            defaultValue={query.token as string}
          />
          <FormButton>Create account</FormButton>
        </Form>
      )}
    </Layout>
  );
};

export default Register;
