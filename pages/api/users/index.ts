import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { User } from 'db/models/User';

const Users = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  if (!loggedIn) formError('base', 'Not authorized');

  const users = await User.findAll({
    attributes: ['id', 'email'],
  });

  return res.json({
    success: true,
    users,
  });
});

export default Users;
