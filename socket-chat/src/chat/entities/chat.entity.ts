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

  @Column()
  groupType: boolean;

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.chat)
  chatUsers: ChatUsers[];
}
