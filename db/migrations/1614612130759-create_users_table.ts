import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    hashed_password: DataType.STRING,
    created_at: DataType.DATE,
    updated_at: DataType.DATE,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('users');
};
