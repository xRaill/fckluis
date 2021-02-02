import type { NextApiRequest, NextApiResponse } from 'next';

type apiContext = (req: NextApiRequest, res: NextApiResponse) => void;

export type ApiHandler = (func: apiContext) => apiContext;

const ApiHandler: ApiHandler = (func) => {
  return (req, res) => {
    func(req, res);
  };
};

export default ApiHandler;
