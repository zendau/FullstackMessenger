import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class UserAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false
  })
  isBanned: boolean;

  @OneToOne(() => User, (User) => User.access)
  @JoinColumn()
  user: User

}
