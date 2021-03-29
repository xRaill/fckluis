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
import { Label } from './Label';
import { ProjectLabel } from './ProjectLabel';

@Table
export class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  author: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public: boolean;

  @BelongsToMany(() => Label, () => ProjectLabel)
  labels: Array<Label & { ProjectLabel: ProjectLabel }>;

  @AllowNull(true)
  @Column(DataType.STRING)
  url: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  file: string;
}
