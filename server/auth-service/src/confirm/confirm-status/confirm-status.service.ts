import { User } from './../../user/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { Confirm } from '../confirm.entity';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(Confirm)
    private confirmRepository: Repository<Confirm>) { }

  async createStatus(user: User, manager: EntityManager) {


    const res = await manager.save(Confirm, {
      confirmCode: null,
      isActivate: false,
      user
    })

    return res;
  }

  async createCode(userId: number) {
    const confirmCode = uuid.v4()
    console.log(confirmCode);
    const res = await this.confirmRepository
      .createQueryBuilder()
      .update()
      .set({
        confirmCode
      })
      .where('userId = :userId', { userId })
      .execute();
    console.log('res', res);
    return res;
  }

  async activateAccount(userId: number) {
    const res = await this.confirmRepository
      .createQueryBuilder()
      .update()
      .set({
        isActivate: true,
        confirmCode: null,
      })
      .where('userId = :userId', { userId })
      .execute();
    console.log('res', res);
    return res;
  }

}
