import Layout from 'components/Layout';
import Search from 'components/Search';

const Home: React.FC = () => {
  return (
    <Layout>
      <Search />
      <span>Hello world!</span>
    </Layout>
  );
};

export default Home;
