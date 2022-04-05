import { Chat } from 'src/chat/entities/chat.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Message {
  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.id)
  chat: Chat;

  @Column()
  authorId: number;

  // TODO: заменить на text
  @Column()
  content: string;
}
