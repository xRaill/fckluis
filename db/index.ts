import { Sequelize } from 'sequelize-typescript';
import { readdirSync } from 'fs';

const { DATABASE_URL, NODE_ENV } = process.env;

export const sequelize = new Sequelize(
  NODE_ENV === 'test' ? 'sqlite:./test.sqlite' : DATABASE_URL,
  {
    define: {
      underscored: true,
    },
    logging:
      NODE_ENV === 'development'
        ? (msg) => console.log('\x1b[1m\x1b[34m%s\x1b[0m', msg)
        : false,
  }
);

// // Load and initialize all models
const models = [];
readdirSync('./db/models').forEach(async (file, i, files) => {
  models.push(
    await import(`./models/${file}`).then(
      (module) => module[file.split('.')[0]]
    )
  );
  if (files.length - 1 === i) sequelize.addModels(models);
});
