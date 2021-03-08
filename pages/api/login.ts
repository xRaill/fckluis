import { User } from 'db/models/User';
import { ApiHandler, formError, formErrorCollection } from 'utils/api';
import { serialize } from 'cookie';
import { Session } from 'db/models/Session';

const Login = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  type strObj = { [key: string]: string };
  const { email, password, remember_me } = req.query as strObj;

  const errors = new formErrorCollection();
  if (!email) errors.add('email', 'Email required');
  if (!password) errors.add('password', 'Password required');
  errors.resolve();

  const user = await User.findOne({ where: { email } });

  if (!user) formError('base', 'Invalid credentials');

  if (!(await user.validatePassword(password)))
    formError('base', 'Invalid credentials');

  enum time {
    month = 2629746000,
    two_hours = 7200000,
  }

  const session = await user.$create<Session>('session', {
    active_for: remember_me ? time.month : time.two_hours,
  });

  const new_sid = session.get('token');
  const access_token = session.generateToken();

  res.setHeader(
    'Set-Cookie',
    serialize('sid', new_sid, {
      expires:
        remember_me &&
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      httpOnly: true,
      path: '/api/auth',
    })
  );

  return res.json({ success: true, access_token });
});

export default Login;
