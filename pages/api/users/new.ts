import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { User } from 'db/models/User';
import validator from 'validator';
import nodemailer from 'utils/nodemailer';
import { v4 } from 'uuid';

const NewUser = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  if (!loggedIn || !loggedIn.admin) formError('base', 'Not authorized');

  const { email } = <Record<string, string>>JSON.parse(req.body);

  if (!email) formError('email', "Can't be empty");

  if (!validator.isEmail(email)) formError('email', 'Is not a valid email');

  const user = await User.findOne({ where: { email } });

  if (user) formError('email', 'User with this email already exists');

  const newUser = await User.create({
    user_token: v4(),
    email,
  });

  nodemailer.sendMail({
    from: 'FC Kluis <info@kluis.fc.school>',
    to: newUser.get('email'),
    subject: 'Uitnodiging voor FC Kluis!',
    text: `You received a request to create an account on FC Kluis! http://localhost:3000/register?token=${newUser.get(
      'user_token'
    )}'`,
    html: `You received a request to create an account on FC Kluis! <br><br> <a href="http://localhost:3000/register?token=${newUser.get(
      'user_token'
    )}">Click here to sign up!</a>`,
  });

  return res.json({
    success: true,
  });
});

export default NewUser;
