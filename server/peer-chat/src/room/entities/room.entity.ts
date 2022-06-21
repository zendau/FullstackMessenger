import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @Column()
  roomTitle: string;

  @Column()
  adminId: number;

  @Column()
  roomWithVideo: boolean;
}
