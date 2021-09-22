import { ApiHandler, formError } from 'utils/api';
import { Session } from 'db/models/Session';
import { serialize } from 'cookie';

const Auth = ApiHandler(async (req, res) => {
  const { sid } = req.cookies;

  if (!sid) formError('base', 'Not authenticated', 401);

  const session = await Session.findOne({ where: { token: sid } });

  if (!session) formError('base', 'Not authenticated', 401);

  const access_token = await session.generateToken();

  if (!access_token) {
    res.setHeader('Set-Cookie', serialize('sid', '', { expires: new Date() }));
    formError('base', 'Session expired');
  }

  return res.json({ success: true, access_token });
});

export default Auth;
