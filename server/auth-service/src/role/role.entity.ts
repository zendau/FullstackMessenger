import { UserRole } from './userRole.entity';
import { User } from 'src/user/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  value: string;

  @Column()
  desc: string;

  @Column()
  accessLevel: number;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userId: UserRole[];
}
