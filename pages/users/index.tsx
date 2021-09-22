import Layout from 'components/Layout';
import useSession from 'hooks/useSession';
import Loading from 'components/Loading';
import styled from 'styled-components';
import Link from 'next/link';
import Table from 'components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faUserTimes,
} from '@fortawesome/free-solid-svg-icons';
import useApi from 'hooks/useApi';
import { useState } from 'react';
import useToast from 'hooks/useToast';

const Container = styled.div`
  display: flex;
  justify-content: center;
  & > table {
    width: 50%;
  }
`;

const LinkButton = styled.a`
  cursor: pointer;
  margin: 20px;
  transition: color 0.5s;
  color: ${({ theme }) => theme.colors.purple};
  &:hover {
    color: ${({ theme }) => theme.colors.lightpurple};
  }
`;

const ActionButton = styled.a`
  cursor: pointer;
  transition: opacity 0.5s;
  opacity: 1;
  margin: 0 10px;
  &:hover {
    opacity: 0.5;
  }
`;

const Users: React.FC = () => {
  const { loggedIn, authenticate } = useSession();
  const { submit, callback } = useApi('users', 'GET');
  const { submit: sumbitRoleChange, callback: callbackRoleChange } = useApi(
    'users/change_role',
    'POST'
  );
  const [data, setData] = useState([]);
  const toast = useToast();

  authenticate(() => submit());

  callback(async (data) => {
    const body = await data.json();
    if (body.success) {
      setData(body.users);
    } else {
      toast({ type: 'danger', message: 'Something went wrong!' });
    }
  });

  const handleRoleChange = (row) => {
    if (
      confirm(
        `Are you sure you want to make ${row.email} an ${
          row.admin ? 'normal user' : 'admin'
        }?`
      )
    ) {
      sumbitRoleChange({ id: row.id, admin: !row.admin });
    }
  };

  callbackRoleChange(
    async (data) => {
      const body = await data.json();
      if (body.success) {
        toast({ type: 'success', message: 'User role updated!' });
        submit();
      } else {
        const error = body.errors.find((err) => err.field == 'toast');
        if (error) {
          toast({ type: 'danger', message: error.message });
        } else {
          toast({ type: 'danger', message: 'Something went wrong!' });
        }
      }
    },
    [loggedIn]
  );

  const handleRemoveUser = () => {
    if (confirm('Are you sure you want to remove this user?')) {
      // remove user api call
    }
  };

  return (
    <Layout>
      <Loading active={loggedIn && !!data.length}>
        <Container>
          <div>
            <Link href={'/users/new'} passHref>
              <LinkButton>Add user</LinkButton>
            </Link>
          </div>
          <Table headers={['#', 'Email', 'Role', 'Actions']} data={data}>
            {(row) => [
              row.id,
              row.email,
              row.admin ? 'Admin' : 'User',
              <div>
                <ActionButton onClick={() => handleRoleChange(row)}>
                  <FontAwesomeIcon
                    icon={row.admin ? faAngleDoubleDown : faAngleDoubleUp}
                    size={'lg'}
                  />
                </ActionButton>
                <ActionButton onClick={handleRemoveUser}>
                  <FontAwesomeIcon icon={faUserTimes} size={'lg'} />
                </ActionButton>
              </div>,
            ]}
          </Table>
        </Container>
      </Loading>
    </Layout>
  );
};

export default Users;
