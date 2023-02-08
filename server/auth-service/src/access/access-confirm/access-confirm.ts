import { User } from '../../user/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { UserAccess } from '../access.entity';
import { NodeMailerService } from '../nodemailer/nodemailer.service';

import IConfirmData from 'src/user/interfaces/IConfirmData';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(UserAccess)
    private accessRepository: Repository<UserAccess>,
    private nodeMailerService: NodeMailerService,
    @InjectRedis() private readonly redis: Redis) { }

  async initAcceesNote(user: User, manager: EntityManager) {

    const confirmCode = uuid.v4()


    const res = await manager.save(UserAccess, {
      confirmCode,
      user
    })

    //this.nodeMailerService.send(confirmCode);
    return res;
  }

  async getBannedStatus(userId: number) {
    const isBannedStatus = await this.accessRepository
      .createQueryBuilder('access')
      .select('access.isBanned')
      .where('access.userId = :userId', { userId })
      .getOne();

    return isBannedStatus;
  }

  async setConfirmCode(confirmData: IConfirmData) {

    try {
      const confirmCode = uuid.v4()

      this.redis.set(confirmData.email, confirmCode);
      this.nodeMailerService.sendConfirmCode(confirmCode, confirmData.email);
      return true;
    } catch {
      return false;
    }
  }

  async checkConfirmCode(userConfrimCode: string, confirmId: string) {

    const confirmCode = await this.redis?.get(confirmId);

    if (confirmCode === userConfrimCode) {
      return {
        status: true,
      }
    }

    return {
      status: false,
      message: `Confirm code is not valid`,
      httpCode: HttpStatus.BAD_REQUEST,
    };
  }

  async deleteConfirmCode(confirmId: string) {
    await this.redis.del(confirmId)
  }



}
