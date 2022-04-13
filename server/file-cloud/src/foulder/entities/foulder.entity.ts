import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Foulder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;
}
