import { hash, verify } from 'argon2';
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import '../';
import { Session } from './Session';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @IsEmail
  @Unique
  @Column(DataType.INTEGER)
  email: string;

  @Column(DataType.STRING)
  hashed_password: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column(DataType.VIRTUAL)
  password_verify: string;

  @HasMany(() => Session)
  sessions: Session[];

  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    if (user.get('password'))
      user.set('hashed_password', await hash(user.get('password')));
  }

  verifyPasswordMatch(): boolean {
    if (this.get('password') && this.get('password_verify')) {
      return this.get('password') !== this.get('password_verify');
    } else return false;
  }

  async validatePassword(password: string): Promise<boolean> {
    return await verify(this.get('hashed_password'), password);
  }
}
