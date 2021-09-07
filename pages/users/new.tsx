import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import Loading from 'components/Loading';

const NewUser: React.FC = () => {
  const { loggedIn, authenticate } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  authenticate();

  const handleSuccess = async (body) => {
    if (body.success) {
      push('/users');
      toast({ type: 'success', message: 'User added' });
    }
  };

  return (
    <Layout>
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
