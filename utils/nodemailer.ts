import { createTransport } from 'nodemailer';
const { PRODUCTION, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

const transporter = createTransport({
  host: MAIL_HOST,
  port: (MAIL_PORT as unknown) as number,
  secure: !!PRODUCTION,
  tls: {
    rejectUnauthorized: !!PRODUCTION,
  },
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export default transporter;
