import { UserRole } from '../role/userRole.entity';
import { Role } from '../role/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roleId: UserRole[];
}
