import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IUserOnline from './interfaces/IUserOnline';
import { UserOnline } from './userOnline.entity';

@Injectable()
export class UserOnlineService {
  constructor(
    @InjectRepository(UserOnline)
    private userOnlineRepository: Repository<UserOnline>,
  ) {}

  async add(userOnlineData: IUserOnline, manager: EntityManager) {
    const resInsered = manager.save(UserOnline, userOnlineData);
    return resInsered;
  }

  async findById(userOnlineId: number) {
    const userOnlineData: IUserOnline = await this.userOnlineRepository
      .createQueryBuilder()
      .where('id = :userOnlineId', { userOnlineId })
      .getOne();

    return userOnlineData;
  }

  async findByUserId(userId: number) {
    const userOnlineData: IUserOnline = await this.userOnlineRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .getOne();
    return userOnlineData;
  }

  async deleteById(userOnlineId: number) {
    const resDeleted = await this.userOnlineRepository
      .createQueryBuilder()
      .delete()
      .where('id = :userOnlineId', { userOnlineId })
      .execute();
    return !!resDeleted.affected;
  }

  async update(userOnlineData: IUserOnline) {
    const resUpdate = await this.userOnlineRepository
      .createQueryBuilder()
      .update()
      .set({
        ...(userOnlineData.lastOnline && {
          lastOnline: userOnlineData.lastOnline,
        }),
      })
      .where('id = :userOnlineId', { userOnlineId: userOnlineData.id })
      .execute();

    return !!resUpdate.affected;
  }
}
