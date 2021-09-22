import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('labels', {
    id: {
      primaryKey: true,
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    created_at: DataType.DATE,
    updated_at: DataType.DATE,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('labels');
};
