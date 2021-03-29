import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import '../';
import { Project } from './Project';
import { ProjectLabel } from './ProjectLabel';

@Table
export class Label extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @BelongsToMany(() => Project, () => ProjectLabel)
  projects: Array<Project & { ProjectLabel: ProjectLabel }>;
}
