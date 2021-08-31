import {
  ApiHandler,
  formError,
  formErrorCollection,
  validateAccessToken,
} from 'utils/api';
import { Project } from 'db/models/Project';
import { Label } from 'db/models/Label';
import { ProjectLabel } from 'db/models/ProjectLabel';
import fileType from 'file-type';
import { mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { createHmac } from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '340MB',
    },
  },
};

const UpdateProject = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);
  if (!loggedIn) formError('base', 'Not authorized');

  const { pid } = req.query as Record<string, unknown>;
  const {
    thumbnail,
    file,
    file_name,
    title,
    description,
    author,
    public: aPublic,
    labels,
  } = JSON.parse(req.body);

  const thumbnailBuffer = thumbnail && Buffer.from(thumbnail, 'base64');
  const fileBuffer = file && Buffer.from(file, 'base64');

  const errors = new formErrorCollection();
  if (!title) errors.add('title', 'Title required');
  if (!description) errors.add('description', 'Description required');
  if (!author) errors.add('author', 'Author required');
  if (
    thumbnail &&
    (await fileType.fromBuffer(thumbnailBuffer))?.mime !== 'image/jpeg'
  )
    errors.add('thumbnail', 'Invalid filetype');
  errors.resolve();

  const project = await Project.findByPk(pid as number);

  if (!project) formError('base', 'Project not found');

  // UPDATING THUMBNAIL

  const thumbnailHash = thumbnail
    ? createHmac('sha1', 'secret').update(thumbnailBuffer).digest('hex')
    : '';

  if (typeof thumbnail !== 'undefined') {
    mkdirSync('public/uploads/thumbnails', { recursive: true });
    if (project.get('thumbnail'))
      unlinkSync(`public/uploads/thumbnails/${project.get('thumbnail')}.jpg`);

    if (thumbnailHash)
      writeFileSync(
        `public/uploads/thumbnails/${thumbnailHash}.jpg`,
        thumbnailBuffer
      );
  }

  // UPDATRING FILE

  const fileName = file
    ? file_name
      ? project.get('id') + '-' + file_name
      : createHmac('sha1', 'secret').update(fileBuffer).digest('hex') + '.zip'
    : '';

  if (typeof file !== 'undefined') {
    mkdirSync('public/uploads/files', { recursive: true });
    if (project.get('file'))
      unlinkSync(`public/uploads/files/${project.get('file')}`);

    if (file) writeFileSync(`public/uploads/files/${fileName}`, fileBuffer);
  }

  // UPDATING BASIC INFO

  await project.update({
    title,
    description,
    author,
    public: aPublic,
    thumbnail: typeof thumbnail === 'undefined' ? undefined : thumbnailHash,
    file: typeof file === 'undefined' ? undefined : fileName,
  });

  // UPDATING LABELS

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
