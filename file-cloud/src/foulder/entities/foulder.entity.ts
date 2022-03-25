import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Foulder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  foulderId: number;
}
