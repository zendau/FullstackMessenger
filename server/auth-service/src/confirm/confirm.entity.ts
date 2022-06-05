import { User } from 'src/user/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Confirm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isActivate: boolean;

  @Column({
    nullable: true
  })
  confirmCode: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User

}
