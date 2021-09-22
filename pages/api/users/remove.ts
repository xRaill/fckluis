import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { User } from 'db/models/User';

const RemoveUser = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  if (!loggedIn || !loggedIn.admin) formError('toast', 'Not authorized');

  const { id } = <Record<string, string>>JSON.parse(req.body);

  if (loggedIn.user_id === id)
    formError('toast', 'You cannot remove yourself!');

  const user = await User.findByPk(id);

  if (!user) formError('toast', 'User does not exist');

  await user.destroy();

  return res.json({
    success: true,
  });
});

export default RemoveUser;
