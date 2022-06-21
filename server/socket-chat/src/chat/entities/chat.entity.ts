import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatUsers } from './chatUsers.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  groupName: string;

  @Column({
    nullable: true,
  })
  adminId: number;

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.chat)
  chatUsers: ChatUsers[];
}
