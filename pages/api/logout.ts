import { ApiHandler } from 'utils/api';
import { serialize } from 'cookie';

const Auth = ApiHandler(async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    serialize('sid', '', {
      expires: new Date(),
      httpOnly: true,
      path: '/api/auth',
    })
  );

  return res.json({ success: true });
});

export default Auth;
