import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { NodeMailerService } from '../access/nodemailer/nodemailer.service';

import { TokenService } from '../token/token.service';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  Repository,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';
import { User } from './user.entity';

import IUser from './interfaces/IUserData';
import IRoleData from './interfaces/IRoleData';
import { hashPassword } from './utils/passwordFactory';

import convertEditUserDTO from './dto/createEditUserDTO';
import { sqlErrorCodes } from './utils/sqlErrorCodes';
import IEditUser from './interfaces/IEditUserData';
import { UserInfoService } from './userInfo.service';
// import { UserOnlineService } from './UserOnline.service';
import { DeviceService } from 'src/token/device.service';
import { UserRole } from './user.entity';
import { Contact } from 'src/contacts/contact.entity';
import { UnionParameters } from 'src/utils/typeorm/union';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import IUserPaginationList from 'src/contacts/interfaces/IUserPaginationList';

@Injectable()
export class UserService {
  private queryRunner: QueryRunner;
  private getUserQuery: SelectQueryBuilder<User>;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
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

  async editUserData(userData: IEditUser) {
    try {
      const checkCode = await this.confirmCodeService.checkConfirmCode(
        userData.confirmCode,
        userData.email,
      );
      if (!checkCode.status) {
        return checkCode;
      }

      const oldUserData: any = await this.getUserById(userData.id);

      if (oldUserData.email !== userData.email) {
        throw new Error();
      }

      if (userData.password !== undefined) {
        const hashedPassword = await hashPassword(userData.password);

        userData.password = hashedPassword;
      }

      const updatedUserData = convertEditUserDTO(userData);

      const statusUpdated = await this.usersRepository
        .createQueryBuilder()
        .update()
        .set(updatedUserData)
        .where('id = :id', { id: userData.id })
        .execute();

      if (!statusUpdated.affected) {
        throw new Error();
      }

      return true;
    } catch (e) {
      if (e.errno === sqlErrorCodes.DuplicateEmail) {
        return {
          status: false,
          message: `email - ${userData.email} is already registered`,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      }

      return {
        status: false,
        message: 'Wrong credentials provided',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findByEmail(email: string) {
    const user: any = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.password, u.role'])
      .where('u.email = :email', { email })
      .getOne();

    if (user !== undefined) {
      return {
        status: true,
        userData: user,
      };
    }

    return {
      status: false,
      message: `Email - ${email} is not found`,
      httpCode: HttpStatus.BAD_REQUEST,
    };
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
    //console.log('sub', await subQuery.getRawMany());

    debugger;
    const start = parseInt(page) * parseInt(limit);

    console.log('start', start, page, limit);

    let query = this.getUserQuery;

    query = query
      .where(`user.id ${isNot ? 'NOT' : ''} IN (${subQuery.getQuery()})`)
      .andWhere('user.id != :userId', { userId });

    if (!Number.isNaN(start)) {
      console.log('setOffset');
      query = query.offset(start).limit(parseInt(limit));
    }

    if (pattern) {
      console.log('set pattern');
      query = query.andWhere('login like :title', {
        title: `%${pattern}%`,
      });
    }

    console.log('userId', query.getQuery());
    debugger;
    const resQuery: any = await query.getMany();

    console.log('resQuery', resQuery);

    const resList = await resQuery.reduce(async (resDataPromise, user) => {
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
    }, Promise.resolve({}));
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
    const user = await this.getUserQuery
      .where('user.id = :id', { id })
      .getOne();

    console.log('GET', user);

    if (user === undefined) {
      return {
        status: false,
        message: `User id - ${id} is not found`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    return user;
  }

  async confirmEmail() {
    //const res = await this.nodeMailerService.send('te');
    // this.cacheManager.set('test', 'tet');
    // return this.cacheManager.get('test');
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
