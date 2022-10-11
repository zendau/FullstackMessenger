import { UserAccess } from './../access/access.entity';
import { UserRole } from '../role/userRole.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRoleTest {
  ADMIN = 2,
  EDITOR = 1,
  GHOST = 0,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  role: UserRole[];

  @OneToOne(() => UserAccess, (UserAccess) => UserAccess.user)
  access: UserAccess;

  @Column({
    type: 'enum',
    enum: UserRoleTest,
    default: UserRoleTest.GHOST,
  })
  test: UserRoleTest;
}
