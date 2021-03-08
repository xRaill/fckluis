import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from '../db/index';
import { readdirSync, readFileSync } from 'fs';

export const migrations = new Umzug({
  migrations: { glob: 'db/migrations/*.ts' },
  create: {
    folder: 'db/migrations',
    template: (filename) => [
      [
        `db/migrations/${Date.now()}-${filename.split('.').reverse()[0]}.ts`,
        readFileSync('db/templates/migration.ts', 'utf8').toString(),
      ],
    ],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'MigrationMeta',
  }),
  logger: console,
});

export type Migrations = typeof migrations._types.migration;

const seedsFileCount = () =>
  readdirSync('db/seeds').length.toString().padStart(2, '0');

export const seeds = new Umzug({
  migrations: { glob: 'db/seeds/*.ts' },
  create: {
    folder: 'db/seeds',
    template: (filepath) => [
      [
        `db/seeds/${seedsFileCount}-${filepath.split('.').reverse()[0]}.ts`,
        readFileSync('db/templates/seed.ts', 'utf8').toString(),
      ],
    ],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'SeederMeta',
  }),
  logger: console,
});

export type Seeds = typeof seeds._types.migration;
