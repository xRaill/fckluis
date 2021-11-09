import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import Loading from 'components/Loading';
import Head from 'next/head';

const NewUser: React.FC = () => {
  const { loggedIn, authenticate, admin } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  authenticate(() => {
    if (!admin) push('/');
  });

  const handleSuccess = async (body) => {
    if (body.success) {
      push('/users');
      toast({ type: 'success', message: 'User added' });
    }
  };

  return (
    <Layout>
      <Head>
        <title>FC Kluis - Add user</title>
      </Head>
      <Loading active={loggedIn}>
        <Form path={'users/new'} onSuccess={handleSuccess}>
          <FormField name={'email'} placeholder={'email@example.com'} />
          <FormButton>Add user</FormButton>
        </Form>
      </Loading>
    </Layout>
  );
};

export default NewUser;
