import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Project from 'components/Project';
import Search from 'components/Search';
import useApi from 'hooks/useApi';
import useSession from 'hooks/useSession';
import { useEffect, useRef, useState } from 'react';
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
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState(['', 'desc']);

  callback(async (data) => {
    const body = await data.json();
    if (body.success) {
      setProjects(body.projects);
    }
  });

  useEffect(() => {
    if (initialized) {
      setProjects([]);
      submit({ search: search[0], order: search[1] });
    }
  }, [initialized, search]);

  return (
    <Layout>
      <Search setSearch={setSearch} active={active} />
      <Loading active={!!projects.length}>
        <ProjectWrapper>
          {projects.map((project, i) => (
            <Project
              key={i}
              id={project.id}
              title={project.title}
              description={project.description}
              author={project.author}
              labels={project.labels}
            />
          ))}
        </ProjectWrapper>
      </Loading>
    </Layout>
  );
};

export default Home;
