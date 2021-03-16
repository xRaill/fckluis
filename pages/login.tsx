import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';

const Home: React.FC = () => {
  const { loggedIn } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  if (loggedIn) push('/');

  return (
    <Layout>
      <Form>
        <FormField name={'email'} placeholder={'email@example.com'} />
        <FormField name={'password'} type={'password'} placeholder={'******'} />
        <FormButton>Login</FormButton>
      </Form>
    </Layout>
  );
};

export default Home;
