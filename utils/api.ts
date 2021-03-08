import type { NextApiRequest, NextApiResponse } from 'next';
import type { ValidationError } from 'sequelize/types';

type apiContext = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type ApiHandler = (func: apiContext) => apiContext;

export const ApiHandler: ApiHandler = (func) => async (req, res) => {
  try {
    await func(req, res);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = (error as ValidationError).errors.map((val) => ({
        field: val.path,
        message: val.message,
      }));
      res.status(400).json({ success: false, errors });
    } else {
      console.log(error);
      res.status(error.code || 400).json(error);
    }
  }
};

type error = { field: string; message: string };

type formError = (
  field: string,
  message: string,
  code?: number
) => { success: boolean; errors: error[] };

export const formError: formError = (field, message, code) => {
  throw {
    success: false,
    code,
    errors: [{ field, message }],
  };
};

export class formErrorCollection {
  errors: error[] = [];

  add(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  resolve(): void {
    const errors = this.errors;
    if (errors.length) throw { success: false, errors };
  }
}
