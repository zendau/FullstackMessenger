import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import { ConfirmCodeService } from '@/access/access-confirm/access-confirm';
import { User } from '@/user/user.entity';
import { hashPassword } from '@/utils/passwordFactory';
import convertEditUserDTO from '@/user/dto/createEditUserDTO';
import { sqlErrorCodes } from '@/utils/sqlErrorCodes';
import IEditUserData from '@/user/interfaces/IEditUserData';
import { UserInfoService } from '@/user/userInfo.service';
import { Contact } from '@/contacts/contact.entity';
import { UnionParameters } from '@/utils/typeorm/union';
import IPublicUserData from '@/user/interfaces/IPublicUserData';
import IUser from '@/user/interfaces/IUser';
import { TokenService } from '@/token/token.service';
import { DetailedRpcException } from '@lib/exception';

@Injectable()
export class UserService {
  private getUserQuery: SelectQueryBuilder<User>;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
    private tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.getUserQuery = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.login',
        'user.lastOnline',
        'user.role',
        'userInfo.phone',
        'userInfo.details',
      ])
      .leftJoin('user.info', 'userInfo')
      .leftJoin('user.access', 'access');
  }

  async editUserData(userData: IEditUserData) {
    try {
      const checkCode = await this.confirmCodeService.checkConfirmCode(
        userData.confirmCode,
        userData.email,
      );
      if (!checkCode.status) {
        return checkCode;
      }

      if (userData.password) {
        const hashedPassword = await hashPassword(userData.password);

        userData.password = hashedPassword;
      }

      const updatedUserData = convertEditUserDTO(userData);

      await this.usersRepository
        .createQueryBuilder()
        .update()
        .set(updatedUserData)
        .where('id = :id', { id: userData.id })
        .execute();

      if (userData?.phone || userData?.details) {
        await this.userInfoService.update({
          ...(userData.phone && { phone: userData.phone }),
          ...(userData.details && { details: userData.details }),
          userId: userData.id,
        });
      }

      delete userData.tokenData.exp;
      delete userData.tokenData.iat;

      userData.tokenData = {
        ...userData.tokenData,
        ...(userData.login && { login: userData.login }),
        ...(userData.newEmail && { email: userData.newEmail }),
        ...(userData.phone && { phone: userData.phone }),
        ...(userData.details && { details: userData.details }),
      };

      const tokens = await this.tokenService.insertTokens(
        userData.tokenData,
        userData.system,
        null,
      );

      return tokens;
    } catch (e) {
      if (e.errno === sqlErrorCodes.DuplicateEmail) {
        throw new DetailedRpcException(
          ['error.takenEmail', userData.email],
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new DetailedRpcException(
        'error.wrongCredentials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByEmail(email: string) {
    const user: IUser = await this.usersRepository
      .createQueryBuilder()
      .select(['id', 'email', 'login', 'password, role'])
      .where('email = :email', { email })
      .getRawOne();

    if (user !== undefined) {
      return {
        status: true,
        userData: user,
      };
    }

    throw new DetailedRpcException(
      ['error.undefinedEmail', email],
      HttpStatus.BAD_REQUEST,
    );
  }

  async getAdditionalUserData(userId: number) {
    const bannedStatus = await this.confirmCodeService.getBannedStatus(userId);
    const userInfo = await this.userInfoService.findByUserId(userId);

    return {
      bannedStatus,
      userInfo,
    };
  }

  async getOtherUsersList(
    subQuery: SelectQueryBuilder<Contact> | UnionParameters,
    userId: number,
    isNot: boolean,
    page: string | undefined,
    limit: string | undefined,
    pattern: string | undefined,
  ) {
    const start = parseInt(page) * parseInt(limit);

    let query = this.getUserQuery;

    query = query
      .where(`user.id ${isNot ? 'NOT' : ''} IN (${subQuery.getQuery()})`)
      .andWhere('user.id != :userId', { userId });

    if (!Number.isNaN(start)) {
      query = query.offset(start).limit(parseInt(limit));
    }

    if (pattern) {
      query = query.andWhere('login like :title', {
        title: `%${pattern}%`,
      });
    }
    const resQuery: any = await query.getMany();

    const resList: Record<number, IPublicUserData> = await resQuery.reduce(
      async (resDataPromise, user: IPublicUserData) => {
        const onlineUserData: string = await this.redis.get(
          `online:${user.id.toString()}`,
        );

        if (onlineUserData) {
          user.lastOnline = 'online';
          user.peerId = JSON.parse(onlineUserData);
        }

        const resData = await resDataPromise;

        return {
          ...resData,
          [user.id]: user,
        };
      },
      Promise.resolve({}),
    );

    return {
      resList,
      hasMore: pattern ? true : resQuery.length === parseInt(limit),
      page: pattern ? 0 : parseInt(page) + 1,
    };
  }

  async getManyUserById(isList: number[]) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.login', 'user.lastOnline'])
      .where('user.id IN (:isList)', { isList })
      .getMany();

    if (user === undefined) return false;

    return user;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.login',
        'user.lastOnline',
        'user.role',
        'userInfo.phone',
        'userInfo.details',
      ])
      .leftJoin('user.info', 'userInfo')
      .leftJoin('user.access', 'access')
      .where('user.id = :id', { id })
      .getOne();

    if (user === undefined) {
      return {
        status: false,
        message: ['error.undefinedUser', id],
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    return user;
  }

  async setLastOnline(userId: number, lastOnline: Date) {
    const user = await this.usersRepository
      .createQueryBuilder()
      .update({
        lastOnline: lastOnline,
      })
      .where('id = :userId', { userId })
      .execute();

    return !!user.affected;
  }
}
