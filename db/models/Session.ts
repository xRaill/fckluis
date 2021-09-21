import { sign } from 'jsonwebtoken';
import {
  AllowNull,
  BeforeValidate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import '../';
import { User } from './User';

const { ACCESS_SECRET } = process.env;

@Table
export class Session extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  token: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  active_for: number;

  @BeforeValidate
  static generateToken(session: Session): void {
    session.set('token', v4());
  }

  valid(): boolean {
    return Date.now() + this.get('active_for') < this.get('updated_at');
  }

  generateToken(): string | boolean {
    if (this.valid()) return false;

    this.changed('updatedAt', true);

    this.save();

    return sign(
      { user_id: this.get('user_id'), exp: Date.now() + 1000 * 60 * 30 },
      ACCESS_SECRET
    );
  }
}
