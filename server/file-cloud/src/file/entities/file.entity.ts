import { Foulder } from './../../foulder/entities/foulder.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
  @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;

  @Column()
  fileName: string;

  @Column()
  fileTempName: string;

  @ManyToOne(() => Foulder, (foulder) => foulder.id)
  foulder: Foulder;

  @JoinColumn({ name: 'foulderId' })
  @Column()
  size: number;

  @Column()
  userId: number;

  @Column()
  mimetype: string;
}
