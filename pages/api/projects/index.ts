import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';

const Projects = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  const dbProjects = await Project.findAll({
    where: loggedIn ? {} : { public: true },
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
