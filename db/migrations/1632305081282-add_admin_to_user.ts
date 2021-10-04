import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn('users', 'admin', {
    type: DataType.BOOLEAN,
    defaultValue: false,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('users', 'admin');
};
