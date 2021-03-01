import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from 'components/Layout';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <InputWrapper>
        <Label htmlFor={'email'}>Email</Label>
        <Input id={'email'} type={'email'} placeholder={'jou@email.nl'} />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor={'password'}>Wachtwoord</Label>
        <Input id={'password'} type={'password'} placeholder={'*********'} />
      </InputWrapper>
      <InputWrapper>
        <Button loading={loading} onClick={() => setLoading(!loading)}>
          <span>Login</span>
          <FontAwesomeIcon icon={faCircleNotch} size={'lg'} spin />
        </Button>
      </InputWrapper>
    </Layout>
  );
};

export default Home;
