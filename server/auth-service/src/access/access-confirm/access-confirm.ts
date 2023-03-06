import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

import { User } from '@/user/user.entity';
import { UserAccess } from '@/access/access.entity';
import { NodeMailerService } from '@/access/nodemailer/nodemailer.service';
import IConfirmData from '@/user/interfaces/IConfirmData';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(UserAccess)
    private accessRepository: Repository<UserAccess>,
    private nodeMailerService: NodeMailerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async initAcceesNote(user: User, manager: EntityManager) {
    const confirmCode = randomInt(1000000).toString().padStart(6, '0');

    const res = await manager.save(UserAccess, {
      confirmCode,
      user,
    });

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
      const confirmCode = randomInt(1000000).toString().padStart(6, '0');

      this.redis.set(`confirm:${confirmData.email}`, confirmCode);
      this.nodeMailerService.sendConfirmCode(confirmCode, confirmData.email);
      return true;
    } catch {
      return false;
    }
  }

  async checkConfirmCode(userConfrimCode: string, confirmId: string) {
    const confirmCode = await this.redis?.get(`confirm:${confirmId}`);

    if (confirmCode === userConfrimCode) {
      return {
        status: true,
      };
    }

    return {
      status: false,
      message: `Confirm code is not valid`,
      httpCode: HttpStatus.BAD_REQUEST,
    };
  }

  async deleteConfirmCode(confirmId: string) {
    await this.redis.del(`confirm:${confirmId}`);
  }
}
