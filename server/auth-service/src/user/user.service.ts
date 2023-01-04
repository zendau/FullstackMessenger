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
import { Cache } from 'cache-manager';

import convertEditUserDTO from './dto/createEditUserDTO';
import { sqlErrorCodes } from './utils/sqlErrorCodes';
import IEditUser from './interfaces/IEditUserData';
import { UserInfoService } from './userInfo.service';
// import { UserOnlineService } from './UserOnline.service';
import { DeviceService } from 'src/token/device.service';
import { UserRole } from './user.entity';
import { Contact } from 'src/contacts/contact.entity';
import { UnionParameters } from 'src/utils/typeorm/union';

@Injectable()
export class UserService {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

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

  async getAllUsers() {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.access', 'access')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.login', 'login')
      .addSelect('access.isBanned', 'isBanned')
      .orderBy('id')
      .getRawMany();
    return users;
  }

  async getOtherUsersList(
    subQuery: SelectQueryBuilder<Contact> | UnionParameters,
    userId: number,
    isNot: boolean,
    page: string | null,
    limit: string | null,
    pattern: string | null,
  ) {
    //console.log('sub', await subQuery.getRawMany());

    debugger;
    const start = parseInt(page) * parseInt(limit);

    console.log('start', start, page, limit);

    let query = this.usersRepository
      .createQueryBuilder()
      .select('id, email, login, lastOnline')
      .where(`id ${isNot ? 'NOT' : ''} IN (${subQuery.getQuery()})`)
      .andWhere('id != :userId', { userId });

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
    const resQuery = await query.getRawMany();
    const resList = resQuery.reduce(
      (prev, curr) => ({ ...prev, [curr.id]: curr }),
      {},
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
      .select(['user.id', 'user.email', 'user.login', 'user.lastOnline'])
      .where('user.id = :id', { id })
      .getOne();

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
    this.cacheManager.set('test', 'tet');

    return this.cacheManager.get('test');
  }

  async setUserRole(userId: number, role: UserRole) {
    const roleObject = Object.values(UserRole);
    if (!roleObject.includes(role)) {
      return {
        status: false,
        message: `Undefined role - ${role}`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const resSetRole = await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        role,
      })
      .where('id = :userId', { userId: userId })
      .execute();

    if (resSetRole.affected) {
      return true;
    } else {
      return {
        status: false,
        message: `Undefined user with id - ${userId}`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
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
