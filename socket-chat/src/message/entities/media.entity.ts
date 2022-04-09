import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileId: number;

  @ManyToOne(() => Message, (message) => message.media)
  message: Message;
}
