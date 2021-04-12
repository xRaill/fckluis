import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import FormArea from 'components/Form/FormArea';
import FormLabels from 'components/Form/FormLabels';
import FormCheckbox from 'components/Form/FormCheckbox';
import Loading from 'components/Loading';
import FormItem from 'components/Form/FormItem';

const NewProject: React.FC = () => {
  const { loggedIn, authenticate } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  authenticate();

  const handleSuccess = () => {
    push('/');
    toast({ type: 'success', message: 'Project created!' });
  };

  return (
    <Layout>
      <Loading active={loggedIn}>
        <Form path={'projects/create'} onSuccess={handleSuccess}>
          <FormField name={'title'} />
          <FormArea name={'description'} />
          <FormField name={'author'} />
          <FormLabels name={'labels'} />
          <FormCheckbox name={'public'} />
          <FormItem inline>
            <FormButton>Create</FormButton>
          </FormItem>
        </Form>
      </Loading>
    </Layout>
  );
};

export default NewProject;
