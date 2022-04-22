import { UserRole } from './userRole.entity';
import { User } from 'src/users/users.entity';
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

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userId: UserRole[];
}
