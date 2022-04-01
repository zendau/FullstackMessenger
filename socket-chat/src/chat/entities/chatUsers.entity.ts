import { Chat } from './chat.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers, {
    cascade: true,
  })
  chat: Chat;

  @Column()
  userId: number;
}
