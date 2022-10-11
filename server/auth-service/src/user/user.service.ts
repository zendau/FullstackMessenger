import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { NodeMailerService } from '../access/nodemailer/nodemailer.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../token/token.service';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, QueryRunner } from 'typeorm';
import { User } from './user.entity';

import IUser from './interfaces/IUserData';
import IRoleData from './interfaces/IRoleData';

import convertUserDTO from './assets/createUserDTO';
import {
  comparePassword,
  hashPassword,
} from './assets/passwordFactory';
import { Cache } from 'cache-manager';

import convertEditUserDTO from './assets/createEditUserDTO';
import { sqlErrorCodes } from './assets/sqlErrorCodes';
import IEditUser from './interfaces/IEditUserData';
import { UserInfoService } from './userInfo.service';
import { UserOnlineService } from './UserOnline.service';
import { DeviceService } from 'src/token/device.service';

@Injectable()
export class UserService {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tokenService: TokenService,
    private roleService: RoleService,
    private nodeMailerService: NodeMailerService,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
    private userOnlineService: UserOnlineService,
    private deviceService: DeviceService,
    private connection: Connection,
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
      .select([
        'u.id',
        'u.email',
        'u.login',
        'u.password',
        'r.id',
        'r.value',
        'r.desc',
      ])
      .innerJoinAndSelect('u.role', 'ur')
      .innerJoinAndSelect('ur.role', 'r')
      .where('u.email = :email', { email })
      .getOne();

    if (user !== undefined) {
      user.role = user.role[0].role;
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

  async getAdditionalUserData(userId: number, roleId: number) {
    const role = await this.roleService.getRoleById(roleId);
    const bannedStatus = await this.confirmCodeService.getBannedStatus(userId);
    const userInfo = await this.userInfoService.findByUserId(userId);

    return {
      role,
      bannedStatus,
      userInfo,
    };
  }

  async getAllUsers() {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'userRole')
      .innerJoinAndSelect('userRole.role', 'role')
      .innerJoinAndSelect('user.access', 'access')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.login', 'login')
      .addSelect('role.value', 'role')
      .addSelect('access.isBanned', 'isBanned')
      .orderBy('id')
      .getRawMany();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.login'])
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
}
