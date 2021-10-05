import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('projects', {
    id: {
      primaryKey: true,
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.TEXT,
      allowNull: true,
    },
    author: {
      type: DataType.STRING,
      allowNull: false,
    },
    public: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    url: {
      type: DataType.STRING,
      allowNull: true,
    },
    file: {
      type: DataType.STRING,
      allowNull: true,
    },
    created_at: DataType.DATE,
    updated_at: DataType.DATE,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('projects');
};
