import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Project from 'components/Project';
import Search from 'components/Search';
import useApi from 'hooks/useApi';
import useRefState from 'hooks/useRefState';
import useSession from 'hooks/useSession';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProjectWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 50px;
`;

const Home: React.FC = () => {
  const { submit, callback, active } = useApi('projects', 'GET');
  const { initialized } = useSession();
  const [projects, setProjects] = useRefState([]);
  const [search, setSearch] = useState<Array<string | number | string[]>>();
  const [page, setPage] = useRefState<number>();
  const [loadMoreActive, setLoadMoreActive] = useState(false);
  const [visible, setVisible] = useState(false);

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

  return (
    <Layout>
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
              file={project.file}
            />
          ))}
        </ProjectWrapper>
      </Loading>
    </Layout>
  );
};

export default Home;
