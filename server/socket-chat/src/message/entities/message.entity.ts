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
import { MessageTypes } from '../interfaces/MessageTypes';

@Entity()
export class Message {
  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chat: Chat;

  @Column({ nullable: true })
  authorLogin: string;

  @Column({ nullable: true })
  authorId: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  text: string;

  @OneToMany(() => Media, (media) => media.message, {
    cascade: ['insert', 'update'],
  })
  files: Media[];

  @Column()
  isEdited: boolean;

  @Column({
    type: 'enum',
    enum: MessageTypes,
    default: MessageTypes.Text,
  })
  type: MessageTypes;
}
