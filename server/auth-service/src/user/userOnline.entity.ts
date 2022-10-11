import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserOnline {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({name: 'userId'})
  userId: number;

  @CreateDateColumn()
  lastOnline: Date;
}
