import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isMedia: boolean;

  @Column()
  fileId: number;
}
