import { ApiHandler, formError } from 'utils/api';
import { User } from 'db/models/User';
import nodemailer from 'utils/nodemailer';
import { v4 } from 'uuid';
import validator from 'validator';

const PasswordForget = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { email } = <Record<string, string>>JSON.parse(req.body);

  if (!email) formError('email', "Can't be empty");

  if (!validator.isEmail(email)) formError('email', 'Is not a valid email');

  const user = await User.findOne({ where: { email } });

  if (user) {
    user.update({
      user_token: v4(),
    });

    nodemailer.sendMail({
      from: 'FC Kluis <info@kluis.fc.school>',
      to: user.get('email'),
      subject: 'FC Kluis password forget!',
      text: `You requested a new password! http://localhost:3000/change_password?token=${user.get(
        'user_token'
      )}'`,
      html: `You requested a new password! <br><br> <a href="http://localhost:3000/change_password?token=${user.get(
        'user_token'
      )}">Click here to change it!</a>`,
    });
  }

  return res.json({
    success: true,
  });
});

export default PasswordForget;
