import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/user/user.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (User) => User.id)
  userId: User[];

  @ManyToOne(() => User, (User) => User.id)
  contactId:  User[];

  @Column({
    default: true
  })
  isContact: boolean;

  @Column({
    default: false
  })
  isBanned: boolean;

}
