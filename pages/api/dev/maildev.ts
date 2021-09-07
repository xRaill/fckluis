import { NextApiHandler } from 'next';
import Maildev from 'maildev';
const { PRODUCTION } = process.env;

const PORT = 1080;

const StartMaildev: NextApiHandler = async (req, res) => {
  if (!PRODUCTION) {
    let body: string | ReadableStream<Uint8Array>;
    try {
      body = (await fetch(`http://localhost:${PORT}/`)).body;
    } catch (e: unknown) {
      if (e['errno'] !== 'ECONNREFUSED') throw e;
    }

    if (body) {
      res.redirect(`http://localhost:${PORT}/`);
    } else {
      new Maildev({ basePathname: '/' } as unknown).listen(() => {
        res.redirect(`http://localhost:${PORT}/`);
      });
    }
  }
};

export default StartMaildev;
