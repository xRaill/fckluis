import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from 'components/Layout';
import useForm from 'hooks/useForm';
import { useGlobalState } from 'hooks/useGlobalState';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const InputWrapper = styled.div`
  width: 40vw;
  margin: 15px auto;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  padding: 5px 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.purple};
`;

const Error = styled.div<{ msg: string }>`
  transition: color 0.5s, height 0.5s;
  height: 0;
  color: transparent;
  ${({ msg }) =>
    msg && {
      color: 'red',
      height: '1em',
    }};
`;

const Input = styled.input`
  outline: none;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 10px;
  font-size: 1em;
  width: 100%;
  padding: 7px 10px;
`;

const Button = styled.button<{ loading: boolean }>`
  border: none;
  background-color: ${({ theme }) => theme.colors.lightpurple};
  color: lightgray;
  padding: 15px 20px;
  margin: 0 auto;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  transition: background-color 0.5s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
  }
  & span {
    display: ${({ loading }) => loading && 'none'};
  }
  & svg {
    display: ${({ loading }) => !loading && 'none'};
  }
`;

const Home: React.FC = () => {
  const [loggedIn] = useGlobalState('loggedIn');
  const [loading, errors, submit, formLogger] = useForm('/api/login');
  const { push } = useRouter();

  if (loggedIn) push('/');

  return (
    <Layout>
      <Error msg={errors.base}>{errors.base}</Error>
      <InputWrapper>
        <Label htmlFor={'email'}>Email</Label>
        <Input
          id={'email'}
          type={'email'}
          placeholder={'jou@email.nl'}
          onChange={formLogger('email')}
        />
        <Error msg={errors.email}>{errors.email}</Error>
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor={'password'}>Wachtwoord</Label>
        <Input
          id={'password'}
          type={'password'}
          placeholder={'*********'}
          onChange={formLogger('password')}
        />
        <Error msg={errors.password}>{errors.password}</Error>
      </InputWrapper>
      <InputWrapper>
        <Button loading={loading} disabled={loading} onClick={submit}>
          <span>Login</span>
          <FontAwesomeIcon icon={faCircleNotch} size={'lg'} spin />
        </Button>
      </InputWrapper>
    </Layout>
  );
};

export default Home;
