import { Chat } from './chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chat: Chat;

  @Column()
  userId: number;
}
