import { User } from '../user/user.entity';
import { Device } from './device.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column('text')
  refreshToken: string;

  @OneToOne(() => Device, (device) => device.tokenId, { cascade: true })
  @JoinColumn({ name: 'deviceId' })
  deviceId: number;

  @CreateDateColumn()
  createdAt: Date;
}
