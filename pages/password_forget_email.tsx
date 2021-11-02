import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useSession from 'hooks/useSession';
import { useEffect } from 'react';
import Head from 'next/head';
import FormButton from 'components/Form/FormButton';

const PasswordForgetEmail: React.FC = () => {
  const { loggedIn } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (loggedIn) push('/');
  }, [loggedIn]);

  return (
    <Layout>
      <Head>
        <title>Fc Kluis - Password forget</title>
      </Head>
      <h3>Email send!</h3>
      <p>Check your email to change your password.</p>
      <FormButton onClick={() => push('/login')}>Return</FormButton>
    </Layout>
  );
};

export default PasswordForgetEmail;
