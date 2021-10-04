import { User } from 'db/models/User';
import validator from 'validator';
import { ApiHandler, formError, formErrorCollection } from 'utils/api';

const Register = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { password, password_verify, token } = <Record<string, string>>(
    JSON.parse(req.body)
  );

  const errors = new formErrorCollection();
  if (!password) errors.add('password', 'Password required');
  if (!password_verify) errors.add('password_verify', 'Password required');
  if (!validator.isUUID(token)) errors.add('base', 'Invalid token given!');
  errors.resolve();

  const user = await User.findOne({
    where: { user_token: token, hashed_password: null },
  });

  if (!user || user.get('hashed_password') !== null)
    formError('base', 'Could not create account!');

  user.set({
    password,
    password_verify,
    user_token: null,
  });

  if (user.verifyPasswordMatch())
    formError('password_verify', 'Passwords do not match');

  await user.save();

  return res.json({ success: true });
});

export default Register;
