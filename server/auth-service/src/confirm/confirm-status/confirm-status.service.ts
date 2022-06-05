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
      confirmCode: uuid.v4(),
      isActivate: false,
      user
    })

    return res;
  }

  async getActivateStatus(userId: number) {
    const activateStatus = await this.confirmRepository
      .createQueryBuilder()
      .select('isActivate')
      .where('userId = :userId', { userId })
      .getOne();

    return activateStatus;
  }

  async setConfirmCode(userId: number) {
    const res = await this.confirmRepository
      .createQueryBuilder()
      .update()
      .set({
        confirmCode: uuid.v4()
      })
      .where('userId = :userId', { userId })
      .execute();
    return res;
  }

  async checkConfirmCode(userConfrimCode: string, userId: number) {
    const confirmStatus = await this.confirmRepository
      .createQueryBuilder('u')
      .select('u.confirmCode')
      .where('u.userId = :userId', { userId })
      .getOne();

    if (confirmStatus.confirmCode === userConfrimCode) return true;
    return false;
  }

  async activateAccount(userId: number) {
    console.log(userId);
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
    return !!res.affected;
  }

}
