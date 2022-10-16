import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/user/user.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'contactId' })
  contactId: number;

  @Column({
    default: false,
  })
  isContact: boolean;

  @Column({
    default: false,
  })
  isBanned: boolean;
}
