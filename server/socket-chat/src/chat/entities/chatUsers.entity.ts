import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from '@/chat/entities/chat.entity';

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
