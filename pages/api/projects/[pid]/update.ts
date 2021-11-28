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
import { mkdirSync, copyFileSync, unlinkSync, writeFileSync } from 'fs';
import { createHmac } from 'crypto';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UpdateProject = ApiHandler(async (req, res) => {
  if (!['POST'].includes(req.method))
    formError('base', `Method ${req.method} not allowed`);

  const { 'x-access-token': accessToken } = <Record<string, string>>req.headers;

  const loggedIn = validateAccessToken(accessToken);
  if (!loggedIn) formError('base', 'Not authorized');

  // PARSE FORM
  const form = new multiparty.Form();
  const result = await new Promise((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) formError('base', 'Could not create project!');
      resolve({ ...files, ...fields });
    });
  });

  Object.keys(result).forEach((key) => {
    if (key === 'labels') {
      if (!result[key][0]) result[key] = [];
      else result[key] = result[key][0].split(',');
      return;
    }
    result[key] = result[key][0];
  });

  const { pid } = req.query as Record<string, unknown>;
  const {
    thumbnail,
    file,
    fileName: originalFilename,
    title,
    description,
    author,
    public: aPublic,
    url,
    labels,
  } = result as Record<string, any>;

  const thumbnailBuffer = thumbnail && Buffer.from(thumbnail, 'base64');

  const errors = new formErrorCollection();
  if (!title) errors.add('title', 'Title required');
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

  mkdirSync('public/uploads/files', { recursive: true });

  let fileName: string = null;

  if (file !== project.get('file')) {
    if (project.get('file'))
      unlinkSync(`public/uploads/files/${project.get('file')}`);

    if (file) {
      fileName = `${project.get('id')}-${originalFilename}`;
      copyFileSync(file.path, `public/uploads/files/${fileName}`);
    }
  } else {
    fileName = undefined;
  }

  // UPDATING BASIC INFO

  await project.update({
    title,
    description,
    author,
    url,
    public: aPublic,
    thumbnail: typeof thumbnail === 'undefined' ? undefined : thumbnailHash,
    file: fileName,
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
