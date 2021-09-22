import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .addColumn('users', 'signup_token', DataType.STRING);
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('users', 'signup_token');
};
