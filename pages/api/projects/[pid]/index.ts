import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';

const Projects = ApiHandler(async (req, res) => {
  if (!['GET'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);

  const { pid } = <Record<string, string>>req.query;

  const project = await Project.findByPk(pid);

  if (!project || (!project.get('public') && !loggedIn))
    formError('base', 'Project not found');

  const labels = await (
    await project.$get('labels')
  ).map((a) => (a.toJSON() as Label).name);

  return res.json({
    success: true,
    project: { ...project.toJSON(), labels },
  });
});

export default Projects;
