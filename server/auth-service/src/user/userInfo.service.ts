import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './userInfo.entity';
import IUserInfo from './interfaces/IUserInfo';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async add(userInfoData: IUserInfo, manager: EntityManager) {
    const resInsered = await manager.save(UserInfo, userInfoData);
    return this.userInfoDTO(resInsered);
  }

  async findById(userInfoId: number) {
    const userInfoData: IUserInfo = await this.userInfoRepository
      .createQueryBuilder()
      .where('id = :userInfoId', { userInfoId })
      .getOne();

    return userInfoData;
  }

  async findByUserId(userId: number) {
    const userInfoData: IUserInfo = await this.userInfoRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .getOne();

    return userInfoData;
  }

  async deleteById(userInfoId: number) {
    const resDeleted = await this.userInfoRepository
      .createQueryBuilder()
      .delete()
      .where('id = :userInfoId', { userInfoId })
      .execute();
    return !!resDeleted.affected;
  }

  async update(userInfoData: IUserInfo) {
    const resUpdate = await this.userInfoRepository
      .createQueryBuilder()
      .update()
      .set({
        ...(userInfoData.details && { details: userInfoData.details }),
        ...(userInfoData.phone && { phone: userInfoData.phone }),
      })
      .where('id = :userInfoId', { userInfoId: userInfoData.id })
      .execute();

    return !!resUpdate.affected;
  }

  userInfoDTO(data: IUserInfo) {
    return {
      phone: data.phone,
      details: data.details,
    };
  }
}
