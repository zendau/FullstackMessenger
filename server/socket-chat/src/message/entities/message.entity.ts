import { Chat } from 'src/chat/entities/chat.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class Message {
  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.id)
  chat: Chat;

  @Column()
  authorLogin: string;

  @Column({
    type: 'text',
  })
  text: string;

  @OneToMany(() => Media, (media) => media.message)
  media: Media[];
}
