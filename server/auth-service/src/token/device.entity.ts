import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Token } from './token.entity';

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

  @OneToOne(() => Token, (token) => token.deviceId)
  tokenId: number;
}
