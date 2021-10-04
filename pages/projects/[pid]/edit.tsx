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
import FormItem from 'components/Form/FormItem';
import FormImageUpload from 'components/Form/FormImageUpload';
import FormFileUpload from 'components/Form/FormFileUpload';

const EditProject: React.FC = () => {
  const {
    query: { pid },
  } = useRouter();
  const { callback: getCallback, submit: getSubmit } = useApi(
    `projects/${pid}`,
    'GET'
  );
  const { callback: delCallback, submit: delSubmit } = useApi(
    `projects/${pid}/destroy`,
    'DELETE'
  );
  const [project, setProject] = useState<Partial<Project>>({});
  const { authenticate } = useSession();
  const { push } = useRouter();
  const toast = useToast();

  authenticate(() => {
    getSubmit();
  });

  getCallback(async (data) => {
    const body = await data.json();
    if (body.success) {
      setProject(body.project);
    } else {
      push('/');
      toast({ type: 'danger', message: body.errors[0].message });
    }
  });

  delCallback(async (data) => {
    const body = await data.json();
    if (body.success) {
      push('/');
      toast({ type: 'success', message: 'Project removed!' });
    }
  });

  const handleSuccess = () => {
    push('/');
    toast({ type: 'success', message: 'Project updated!' });
  };

  const confirmDeletion = () => {
    if (confirm('Are you sure you want to delete this project?')) delSubmit();
  };

  return (
    <Layout>
      <Loading active={!!Object.values(project).length}>
        <Form path={`projects/${pid}/update`} onSuccess={handleSuccess}>
          <FormImageUpload
            name={'thumbnail'}
            src={
              project.thumbnail &&
              `/uploads/thumbnails/${project.thumbnail}.jpg`
            }
          />
          <FormField name={'title'} defaultValue={project.title} />
          <FormArea name={'description'} defaultValue={project.description} />
          <FormField name={'author'} defaultValue={project.author} />
          <FormField name={'url'} defaultValue={project.url} />
          <FormFileUpload
            name={'file'}
            accept={
              'application/zip,application/x-zip-compressed,multipart/x-zip,application/x-rar-compressed,application/octet-stream'
            }
            value={project.file}
          />
          <FormLabels
            name={'labels'}
            title={'tags'}
            activeLabels={project.labels as unknown as string[]}
          />
          <FormCheckbox name={'public'} checked={project.public} />
          <FormItem inline>
            <FormButton color={'red'} onClick={confirmDeletion}>
              Remove
            </FormButton>
            <FormButton>Update</FormButton>
          </FormItem>
        </Form>
      </Loading>
    </Layout>
  );
};

export default EditProject;
