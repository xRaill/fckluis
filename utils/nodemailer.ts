import { createTransport } from 'nodemailer';
const { NODE_ENV, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

const transporter = createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT as unknown as number,
  secure: NODE_ENV === 'production',
  tls: {
    rejectUnauthorized: NODE_ENV === 'production',
  },
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export default transporter;
