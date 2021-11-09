import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Project, { ProjectDetails } from 'components/Project';
import Search from 'components/Search';
import useApi from 'hooks/useApi';
import useRefState from 'hooks/useRefState';
import useSession from 'hooks/useSession';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';

const ProjectWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 50px;
`;

const Home: React.FC = () => {
  const { submit, callback, active } = useApi('projects', 'GET');
  const { asPath } = useRouter();
  const [projectId] = useState<number>(
    parseInt(asPath.match(/\/projects\/([0-9]*)/)?.[1])
  );
  const { submit: submitProject, callback: callbackProject } = useApi(
    `projects/${projectId}`,
    'GET'
  );
  const [project, setProject] = useState<ProjectDetails>();
  const { initialized } = useSession();
  const [projects, setProjects] = useRefState([]);
  const [search, setSearch] = useState<Array<string | number | string[]>>();
  const [page, setPage] = useRefState<number>();
  const [loadMoreActive, setLoadMoreActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const toast = useToast();

  callback(
    async (data) => {
      const body = await data.json();
      if (body.success) {
        setProjects(
          page.current ? projects.current.concat(body.projects) : body.projects
        );
        setPage(body.more ? (page.current || 1) + 1 : undefined);
        setLoadMoreActive(false);
        setVisible(true);
      }
    },
    [projects, page]
  );

  useEffect(() => {
    if (initialized && search) {
      setProjects([]);
      setPage(undefined);
      setVisible(false);
      submit({
        search: search[0],
        order: search[1],
        labels: search[2],
        page: search[3] || 1,
      });
    }
  }, [initialized, search]);

  const scrollEvent = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      page.current &&
      !loadMoreActive
    ) {
      setLoadMoreActive(true);
      submit({
        search: search[0],
        order: search[1],
        labels: search[2],
        page: page.current,
      });
    }
  };

  useEffect(() => {
    const el = document.querySelector('.simplebar-content-wrapper');
    el.addEventListener('scroll', scrollEvent);
    return () => el.removeEventListener('scroll', scrollEvent);
  }, [page, search, loadMoreActive]);

  useEffect(() => {
    if (projectId) submitProject();
  }, []);

  callbackProject(
    async (data) => {
      const body = await data.json();
      if (body.success) setProject(body.project);
      else toast({ type: 'danger', message: 'Project not found!' });
    },
    [project]
  );

  return (
    <Layout>
      <Head>
        <title>FC Kluis</title>
        <meta
          name={'description'}
          content={
            'FC Kluis is where you can see all project created by students on the Friesland College'
          }
        />
        <meta name={'robots'} content={'index, follow'} />
      </Head>
      <Search setSearch={setSearch} active={active} />
      <Loading active={visible}>
        <ProjectWrapper>
          {projects.current.map((project, i) => (
            <Project
              key={i}
              id={project.id}
              title={project.title}
              description={project.description}
              author={project.author}
              labels={project.labels}
              thumbnail={project.thumbnail}
              url={project.url}
              file={project.file}
            />
          ))}
        </ProjectWrapper>
        {project && (
          <Project
            id={project.id}
            title={project.title}
            description={project.description}
            author={project.author}
            labels={project.labels}
            thumbnail={project.thumbnail}
            url={project.url}
            file={project.file}
            standalone
          />
        )}
      </Loading>
    </Layout>
  );
};

export default Home;
