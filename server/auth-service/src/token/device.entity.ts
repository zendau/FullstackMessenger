import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  osName: string;

  @Column()
  osVersion: string;

  @Column()
  ipAdress: string;
}
