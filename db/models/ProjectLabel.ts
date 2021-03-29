import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import '../';
import { Project } from './Project';
import { Label } from './Label';

@Table
export class ProjectLabel extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  projectId: number;

  @ForeignKey(() => Label)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  labelId: number;
}
