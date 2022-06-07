import { User } from '../../user/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
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

    const confirmCode = uuid.v4()

    console.log(`send confirm - ${confirmCode} to ${user.email}`);

    const res = await manager.save(Confirm, {
      confirmCode,
      isActivate: false,
      user
    })

    return res;
  }

  async getActivateStatus(userId: number) {
    const activateStatus = await this.confirmRepository
      .createQueryBuilder('confirm')
      .select('confirm.isActivate')
      .where('confirm.userId = :userId', { userId })
      .getOne();

    return activateStatus;
  }

  async setConfirmCode(user: User) {
    const confirmCode = uuid.v4()

    console.log(`send confirm - ${confirmCode} to ${user.email}`);

    const res = await this.confirmRepository
      .createQueryBuilder()
      .update()
      .set({
        confirmCode
      })
      .where('userId = :userId', { userId: user.id })
      .execute();
    return !!res.affected;
  }

  async checkConfirmCode(userConfrimCode: string, userId: number) {
    const confirmStatus = await this.confirmRepository
      .createQueryBuilder('u')
      .select('u.confirmCode')
      .where('u.userId = :userId', { userId })
      .getOne();

    debugger
    if (confirmStatus === undefined)
      return {
        status: false,
        message: `Confirm code is not found`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    if (confirmStatus.confirmCode === userConfrimCode)
      return {
        status: true,
      };
    return {
      status: false,
      message: `Confirm code is not valid`,
      httpCode: HttpStatus.BAD_REQUEST,
    };
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
