import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  chatId: string;

  @Column()
  roomTitle: string;

  @Column()
  adminLogin: string;

  @Column()
  roomWithVideo: boolean;
}
