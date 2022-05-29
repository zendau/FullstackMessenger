import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ChatUsers } from './chatUsers.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: string;

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
