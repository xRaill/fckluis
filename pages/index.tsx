import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Project from 'components/Project';
import Search from 'components/Search';
import useApi from 'hooks/useApi';
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
  const { submit, callback } = useApi('projects', 'GET');
  const { initialized } = useSession();
  const [projects, setProjects] = useState([]);

  callback(async (data) => {
    const body = await data.json();
    setProjects(body.projects);
  });

  useEffect(() => {
    if (initialized) submit();
  }, [initialized]);

  return (
    <Layout>
      <Search />
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
