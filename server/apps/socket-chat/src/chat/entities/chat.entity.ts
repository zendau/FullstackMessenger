import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatUsers } from '@/chat/entities/chatUsers.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  adminId: number;

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.chat)
  chatUsers: ChatUsers[];
}
