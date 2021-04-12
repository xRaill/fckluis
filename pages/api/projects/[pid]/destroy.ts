import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { ProjectLabel } from 'db/models/ProjectLabel';

const UpdateProject = ApiHandler(async (req, res) => {
  if (!['DELETE'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);
  if (!loggedIn) formError('base', 'Not authorized');

  const { pid } = req.query as Record<string, unknown>;

  const project = await Project.findByPk(pid as number);

  if (!project) formError('base', 'Project not found');

  const labels = await project.$get('labels');

  labels.forEach(async (label) => {
    await project.$remove('label', label);

    if (!(await ProjectLabel.count({ where: { labelId: label.get('id') } })))
      await label.destroy();
  });

  await project.destroy();

  return res.json({ success: true });
});

export default UpdateProject;
