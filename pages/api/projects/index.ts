import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';
import { Op } from 'sequelize';

const Projects = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  const { search, order } = <Record<string, string>>req.query;

  if (order && !['desc', 'asc'].includes(order))
    formError('order', `Invalid order`);

  const searchquery = search
    ? {
        [Op.or]: {
          title: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
        },
      }
    : {};

  const publicquery = loggedIn ? {} : { public: true };

  const dbProjects = await Project.findAll({
    where: {
      ...searchquery,
      ...publicquery,
    },
    order: [['createdAt', order || 'desc']],
    include: { model: Label },
  });

  const projects = dbProjects
    .map((a) => a.toJSON())
    .map((project: Project) => ({
      ...project,
      labels: project.labels.map((a) => a.name),
    }));

  return res.json({ success: true, projects });
});

export default Projects;
