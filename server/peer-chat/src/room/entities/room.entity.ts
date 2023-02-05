import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  withVideo: boolean;
}
