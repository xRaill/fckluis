import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';
import { Op, Sequelize } from 'sequelize';

const Projects = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  const { search, order, labels } = <Record<string, string>>req.query;

  if (labels && labels.match(/([^\p{L},])/gu))
    formError('labels', 'Contains illegal character');
  if (order && !['desc', 'asc'].includes(order))
    formError('order', 'Invalid order');

  const searchquery = search
    ? {
        [Op.or]: {
          title: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
        },
      }
    : {};

  const publicquery = loggedIn ? {} : { public: true };

  const labelsquery = labels
    ? {
        id: {
          [Op.in]: Sequelize.literal(`(
            SELECT DISTINCT pl.project_id
            FROM labels as l
            INNER JOIN project_labels pl ON l.id = pl.label_id
            WHERE l.name IN ('${labels.replaceAll(',', "', '")}')
            GROUP BY pl.project_id
            HAVING COUNT(l.id) == ${labels.split(',').length}
        )`),
        },
      }
    : {};

  const dbProjects = await Project.findAll({
    where: {
      ...labelsquery,
      ...searchquery,
      ...publicquery,
    },
    order: [['createdAt', order || 'desc']],
    include: [Label],
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
