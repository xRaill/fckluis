import { createTransport } from 'nodemailer';
const { PRODUCTION, MAIL_HOST, MAIL_PORT } = process.env;

const transporter = createTransport({
  host: MAIL_HOST,
  port: (MAIL_PORT as unknown) as number,
  secure: !!PRODUCTION,
  tls: {
    rejectUnauthorized: !!PRODUCTION,
  },
});

export default transporter;
