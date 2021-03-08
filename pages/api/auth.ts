import { ApiHandler, formError } from 'utils/api';
import { Session } from 'db/models/Session';

const Auth = ApiHandler(async (req, res) => {
  const { sid } = req.cookies;

  if (!sid) formError('base', 'Not authenticated', 401);

  const session = await Session.findOne({ where: { token: sid } });

  if (!session) formError('base', 'Not authenticated', 401);

  const access_token = session.generateToken();

  if (!access_token) formError('base', 'Session expired');

  return res.json({ success: true, access_token });
});

export default Auth;
