import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Message } from '@/message/entities/message.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileId: number;

  @ManyToOne(() => Message, (message) => message.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  message: string;
}
