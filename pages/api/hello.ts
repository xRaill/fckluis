import ApiHandler from '../../utils/api';

const Hello = ApiHandler((req, res) => {
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
});

export default Hello;
