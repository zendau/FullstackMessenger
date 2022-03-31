import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: string;

  @Column()
  userId: number;
}
