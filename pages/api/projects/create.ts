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
import { createHmac } from 'crypto';
import { mkdirSync, writeFileSync, renameSync } from 'fs';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

const CreateProject = ApiHandler(async (req, res) => {
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

  const {
    thumbnail,
    file,
    title,
    description,
    author,
    url,
    public: aPublic,
    labels,
  } = result as Record<string, any>;

  const thumbnailBuffer = thumbnail && Buffer.from(thumbnail, 'base64');

  const errors = new formErrorCollection();
  if (!title) errors.add('title', 'Title required');
  if (!description) errors.add('description', 'Description required');
  if (!author) errors.add('author', 'Author required');
  if (thumbnail && (await fileType.fromBuffer(thumbnailBuffer))?.ext !== 'jpg')
    errors.add('thumbnail', 'Invalid filetype');
  errors.resolve();

  // CREATING THUMBNAIL

  const thumbnailHash = thumbnail
    ? createHmac('sha1', 'secret').update(thumbnailBuffer).digest('hex')
    : undefined;

  if (thumbnailHash)
    writeFileSync(
      `public/uploads/thumbnails/${thumbnailHash}.jpg`,
      thumbnailBuffer
    );

  // CREATING BASIC INFO

  const project = await Project.create({
    title,
    description,
    public: aPublic,
    url,
    author,
    thumbnail: thumbnailHash,
  });

  // CREATING FILE

  if (file) {
    mkdirSync('public/uploads/files', { recursive: true });

    const fileName = `${project.id}-${file.originalFilename}`;

    renameSync(file.path, `public/uploads/files/${fileName}`);

    await Project.update({ file: fileName }, { where: { id: project.id } });
  }

  // CREATING LABELS

  const dbLabels = await Label.findAll({ where: { name: labels } });

  let prevLabels = labels;

  dbLabels.forEach(async (label) => {
    prevLabels = prevLabels.filter(
      (a: string) => a !== label.getDataValue('name')
    );
    await ProjectLabel.create({
      projectId: project.id,
      labelId: label.getDataValue('id'),
    });
  });

  prevLabels.forEach(async (name) => {
    const label = await Label.create({ name });
    await ProjectLabel.create({ projectId: project.id, labelId: label.id });
  });

  return res.json({ success: true });
});

export default CreateProject;
