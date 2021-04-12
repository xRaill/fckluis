import {
  ApiHandler,
  formError,
  formErrorCollection,
  validateAccessToken,
} from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';
import { ProjectLabel } from 'db/models/ProjectLabel';

const UpdateProject = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);
  if (!loggedIn) formError('base', 'Not authorized');

  const { pid } = req.query as Record<string, unknown>;
  const { title, description, author, public: aPublic, labels } = JSON.parse(
    req.body
  );

  const errors = new formErrorCollection();
  if (!title) errors.add('title', 'Title required');
  if (!description) errors.add('description', 'Description required');
  if (!author) errors.add('author', 'Author required');
  errors.resolve();

  const project = await Project.findByPk(pid as number);

  if (!project) formError('base', 'Project not found');

  await project.update({
    title,
    description,
    author,
    public: aPublic,
  });

  const dbLabels = await project.$get('labels');

  let prevLabels = labels;

  dbLabels.forEach(async (label) => {
    const a = prevLabels;
    prevLabels = prevLabels.filter((a: string) => a !== label.get('name'));
    if (!a.includes(label.get('name'))) {
      await label.ProjectLabel.destroy();

      if (!(await ProjectLabel.count({ where: { labelId: label.get('id') } })))
        await label.destroy();
    }
  });

  prevLabels.forEach(async (name: string) => {
    let label = await Label.findOne({ where: { name } });
    if (!label) label = await Label.create({ name });
    await ProjectLabel.create({
      projectId: project.get('id'),
      labelId: label.id || label.get('id'),
    });
  });

  return res.json({ success: true });
});

export default UpdateProject;
