import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .addColumn('projects', 'thumbnail', DataType.STRING);
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('projects', 'thumbnail');
};
