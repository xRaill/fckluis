import { DataType } from 'sequelize-typescript';
import { Migrations } from 'db/umzug';

export const up: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('sessions', {
    token: {
      primaryKey: true,
      type: DataType.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    active_for: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    created_at: DataType.DATE,
    updated_at: DataType.DATE,
  });
};

export const down: Migrations = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('sessions');
};
