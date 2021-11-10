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
import FormImageUpload from 'components/Form/FormImageUpload';
import FormFileUpload from 'components/Form/FormFileUpload';
import Head from 'next/head';

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
      <Head>
        <title>FC Kluis - Create project</title>
      </Head>
      <Loading active={loggedIn}>
        <Form path={'projects/create'} onSuccess={handleSuccess} multipart>
          <FormImageUpload name={'thumbnail'} />
          <FormField name={'title'} />
          <FormArea name={'description'} />
          <FormField name={'author'} />
          <FormField name={'url'} />
          <FormFileUpload
            name={'file'}
            accept={
              'application/zip,application/x-zip-compressed,multipart/x-zip,application/x-rar-compressed,application/octet-stream'
            }
          />
          <FormLabels title={'tags'} name={'labels'} />
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
