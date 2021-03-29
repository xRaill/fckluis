import { Label } from 'db/models/Label';
import { ApiHandler, formError } from 'utils/api';

const Auth = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const labels = await Label.findAll({ attributes: ['name'] });

  return res.json({ success: true, labels });
});

export default Auth;
