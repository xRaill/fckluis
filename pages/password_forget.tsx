import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import { useEffect } from 'react';
import Head from 'next/head';

const PasswordForget: React.FC = () => {
  const { loggedIn } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (loggedIn) push('/');
  }, [loggedIn]);

  const handleSuccess = () => {
    push('/');
    toast({ type: 'success', message: 'Requested new password!' });
  };

  return (
    <Layout>
      <Head>
        <title>Fc Kluis - Password forget</title>
      </Head>
      {!loggedIn && (
        <Form path={'users/password_forget'} onSuccess={handleSuccess}>
          <FormField name={'email'} placeholder={'email@example.com'} />
          <FormButton>Request new password</FormButton>
        </Form>
      )}
    </Layout>
  );
};

export default PasswordForget;
