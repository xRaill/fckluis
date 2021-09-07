import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { User } from 'db/models/User';

const NewUser = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  if (!loggedIn) formError('base', 'Not authorized');

  const { email } = <Record<string, string>>JSON.parse(req.body);

  if (!email) formError('email', "Can't be empty");

  const user = await User.findOne({ where: { email } });

  if (user) formError('email', 'User with this email already exists');

  // Create user

  // Send email with reg token

  return res.json({
    success: true,
  });
});

export default NewUser;
