import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import useSession from 'hooks/useSession';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import FormButton from 'components/Form/FormButton';
import { useState } from 'react';
import FormArea from 'components/Form/FormArea';
import FormLabels from 'components/Form/FormLabels';
import FormCheckbox from 'components/Form/FormCheckbox';
import useApi from 'hooks/useApi';
import Loading from 'components/Loading';
import { Project } from 'db/models/Project';

const EditProject: React.FC = () => {
  const {
    query: { pid },
  } = useRouter();
  const { callback, submit } = useApi(`projects/${pid}`, 'GET');
  const [project, setProject] = useState<Partial<Project>>({});
  const { authenticate } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  authenticate(() => {
    submit();
  });

  callback(async (data) => {
    const body = await data.json();
    setProject(body.project);
  });

  const handleSuccess = () => {
    push('/');
    toast({ type: 'success', message: 'Project updated!' });
  };

  return (
    <Layout>
      <Loading active={!!Object.values(project).length}>
        <Form path={`projects/${pid}/update`} onSuccess={handleSuccess}>
          <FormField name={'title'} value={project.title} />
          <FormArea name={'description'} value={project.description} />
          <FormField name={'author'} value={project.author} />
          <FormLabels
            name={'labels'}
            activeLabels={(project.labels as unknown) as string[]}
          />
          <FormCheckbox name={'public'} checked={project.public} />
          <FormButton>Update</FormButton>
        </Form>
      </Loading>
    </Layout>
  );
};

export default EditProject;
