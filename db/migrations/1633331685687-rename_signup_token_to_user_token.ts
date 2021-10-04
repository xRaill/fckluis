import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .renameColumn('users', 'signup_token', 'user_token');
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .renameColumn('users', 'user_token', 'signup_token');
};
