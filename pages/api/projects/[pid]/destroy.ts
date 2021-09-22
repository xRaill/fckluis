import { ApiHandler, formError, validateAccessToken } from 'utils/api';
import { Project } from 'db/models/Project';
import { ProjectLabel } from 'db/models/ProjectLabel';
import { mkdirSync, unlinkSync } from 'fs';

const DestroyProject = ApiHandler(async (req, res) => {
  if (!['DELETE'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);
  if (!loggedIn) formError('base', 'Not authorized');

  const { pid } = req.query as Record<string, unknown>;

  const project = await Project.findByPk(pid as number);

  if (!project) formError('base', 'Project not found');

  // DESTROYING THUMBNAIL

  if (project.get('thumbnail')) {
    mkdirSync('public/uploads/thumbnails', { recursive: true });
    unlinkSync(`public/uploads/thumbnails/${project.get('thumbnail')}.jpg`);
  }

  // DESTROYING LABELS

  const labels = await project.$get('labels');

  labels.forEach(async (label) => {
    await project.$remove('label', label);

    if (!(await ProjectLabel.count({ where: { labelId: label.get('id') } })))
      await label.destroy();
  });

  // DESTROYING PROJECT

  await project.destroy();

  return res.json({ success: true });
});

export default DestroyProject;
