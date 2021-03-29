import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('project_labels', {
    id: {
      primaryKey: true,
      type: DataType.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataType.INTEGER,
      allowNull: false,
      references: { model: 'projects', key: 'id' },
    },
    label_id: {
      type: DataType.INTEGER,
      allowNull: false,
      references: { model: 'labels', key: 'id' },
    },
    created_at: DataType.DATE,
    updated_at: DataType.DATE,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('project_labels');
};
