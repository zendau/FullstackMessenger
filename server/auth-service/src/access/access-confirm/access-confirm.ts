import { User } from '../../user/user.entity';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { UserAccess } from '../access.entity';
import { NodeMailerService } from '../nodemailer/nodemailer.service';
import { Cache } from 'cache-manager';
import IConfirmData from 'src/user/interfaces/IConfirmData';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(UserAccess)
    private accessRepository: Repository<UserAccess>,
    private nodeMailerService: NodeMailerService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache) { }

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

      this.cacheManager.set(confirmData.email, confirmCode);
      this.nodeMailerService.sendConfirmCode(confirmCode, confirmData.email);
      return true;
    } catch {
      return false;
    }
  }

  async checkConfirmCode(userConfrimCode: string, confirmId: string) {

    const confirmCode = await this.cacheManager?.get(confirmId);

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
    await this.cacheManager.del(confirmId)
  }

  async setUnblock(userId: number) {
    const res = await this.accessRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: false
      })
      .where('userId = :userId', { userId })
      .execute();
    return !!res.affected;
  }

  async setBlock(userId: number) {
    console.log(userId);
    const res = await this.accessRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: true
      })
      .where('userId = :userId', { userId })
      .execute();
    return !!res.affected;
  }

}
