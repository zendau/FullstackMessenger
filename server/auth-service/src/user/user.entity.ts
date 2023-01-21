import { UserAccess } from './../access/access.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
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

  @OneToOne(() => UserAccess, (UserAccess) => UserAccess.user)
  access: UserAccess;

  @CreateDateColumn()
  lastOnline: Date | string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
