import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface();
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface();
};
