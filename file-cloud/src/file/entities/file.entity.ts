import { Foulder } from './../../foulder/entities/foulder.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileTempName: string;

  @ManyToOne(() => Foulder, (foulder) => foulder.id)
  @JoinColumn({ name: 'foulderId' })
  foulderId: number;

  @Column()
  userId: number;
}
