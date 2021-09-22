import { hash } from 'argon2';
import { Seeds } from 'db/umzug';

export const up: Seeds = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert('users', [
    {
      id: 1,
      email: 'admin@kluis.fc.school',
      hashed_password: await hash('testen'),
      admin: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

export const down: Seeds = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete('users', {
    id: 1,
    email: 'admin@kluis.fc.school',
  });
};
