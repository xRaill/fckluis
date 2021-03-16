import Layout from 'components/Layout';
import Project from 'components/Project';
import Search from 'components/Search';
import styled from 'styled-components';

const ProjectWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Home: React.FC = () => {
  return (
    <Layout>
      <Search />
      <span>Hello world!</span>
      <ProjectWrapper>
        <Project
          title={'TEST1'}
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit reiciendis doloribus vel corrupti modi veritatis nemo natus quod vitae ipsa porro minima, ex fugiat at repellendus accusantium dolorum animi consequatur?Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit reiciendis doloribus vel corrupti modi veritatis nemo natus quod vitae ipsa porro minima, ex fugiat at repellendus accusantium dolorum animi consequatur?Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit reiciendis doloribus vel corrupti modi veritatis nemo natus quod vitae ipsa porro minima, ex fugiat at repellendus accusantium dolorum animi consequatur?'
          }
          author={'Railly Koeiman'}
          labels={['test1', 'test2', 'test2', 'test2', 'test2']}
        />
        <Project
          title={'TEST2'}
          description={'test1234'}
          url={'https://duckduckgo.nl'}
          file={'some-file-1.zip'}
        />
        <Project
          title={'TEST2'}
          description={'test1234'}
          url={'https://duckduckgo.nl'}
          file={'some-file-1.zip'}
        />
        <Project
          title={'TEST2'}
          description={'test1234'}
          url={'https://duckduckgo.nl'}
          file={'some-file-1.zip'}
        />
      </ProjectWrapper>
    </Layout>
  );
};

export default Home;
