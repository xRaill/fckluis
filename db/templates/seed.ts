import { Seeds } from 'db/umzug';

export const up: Seeds = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface();
};

export const down: Seeds = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface();
};
