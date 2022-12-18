import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { NodeMailerService } from '../access/nodemailer/nodemailer.service';
import { TokenService } from '../token/token.service';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, QueryRunner } from 'typeorm';
import { User } from './user.entity';

import IUser from './interfaces/IUserData';
import { comparePassword, hashPassword } from './utils/passwordFactory';
import { Cache } from 'cache-manager';
import { UserService } from './user.service';
import { UserInfoService } from './userInfo.service';
// import { UserOnlineService } from './UserOnline.service';
import convertUserDTO from './dto/createUserDTO';
import { DeviceService } from 'src/token/device.service';
import { IDevice } from 'src/token/interfaces/ITokenDevice';
import IRefreshData from './interfaces/IRefreshData';

@Injectable()
export class AuthService {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tokenService: TokenService,
    private userService: UserService,
    private nodeMailerService: NodeMailerService,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
    // private userOnlineService: UserOnlineService,
    private deviceService: DeviceService,
    private connection: Connection,
  ) {}

  async register(userData: IUser): Promise<any> {
    // const checkCode = await this.confirmCodeService.checkConfirmCode(userData.confirmCode, userData.email);

    // if (!checkCode.status) {
    //   return checkCode
    // }

    const hashedPassword = await hashPassword(userData.password);

    const userEntity = this.usersRepository.create();
    userEntity.email = userData.email;
    userEntity.password = hashedPassword;
    userEntity.login = userData.login;

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const resUserInsered = await this.queryRunner.manager.save(
        User,
        userEntity,
      );

      const tokens = await this.registerTransaction(
        resUserInsered,
        userData.system,
      );

      await this.queryRunner.commitTransaction();
      await this.confirmCodeService.deleteConfirmCode(userData.email);
      return tokens;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      return {
        status: false,
        message: 'Wrong credentials provided',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  async login(userData: IUser) {
    try {
      const resUserData = await this.userService.findByEmail(userData.email);
      if (!resUserData.status) return resUserData;

      const resComparePasswords = await comparePassword(
        userData.password,
        resUserData.userData.password,
      );

      if (!resComparePasswords.status) {
        return resComparePasswords;
      }

      const { bannedStatus, userInfo } =
        await this.userService.getAdditionalUserData(resUserData.userData.id,);

      const tokens = this.tokenService.insertTokens(
        {
          ...convertUserDTO(resUserData.userData),
          isBanned: bannedStatus.isBanned,
          info: userInfo,
        },
        userData.system,
        null,
      );

      await this.confirmCodeService.deleteConfirmCode(userData.email);
      return tokens;
    } catch (e) {
      console.log(e);
      return {
        status: false,
        message: e.message,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  private async registerTransaction(userData: User, deviceData: IDevice) {

    const accessData = await this.confirmCodeService.initAcceesNote(
      userData,
      this.queryRunner.manager,
    );

    const userInfo = await this.userInfoService.add(
      { userId: userData.id },
      this.queryRunner.manager,
    );
    // await this.userOnlineService.add(
    //   {
    //     userId: userData.id,
    //   },
    //   this.queryRunner.manager,
    // );

    const deviceId = await this.deviceService.add(deviceData);

    const tokens = await this.tokenService.insertTokens(
      {
        ...convertUserDTO(userData),
        info: userInfo,
        isBanned: accessData.isBanned,
      },
      deviceId,
      this.queryRunner.manager,
    );

    return tokens;
  }

  async resetUserPassword(userData: IUser) {
    const checkCode = await this.confirmCodeService.checkConfirmCode(
      userData.confirmCode,
      userData.email,
    );

    if (!checkCode.status) {
      return checkCode;
    }

    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await hashPassword(newPassword);

    const statusUpdated = await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        password: hashedPassword,
      })
      .where('email = :email', { email: userData.email })
      .execute();

    if (!statusUpdated.affected) {
      return {
        status: false,
        message: 'Not valid reset data',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    await this.confirmCodeService.deleteConfirmCode(userData.email);
    this.nodeMailerService.sendPassword(newPassword, userData.email);
    return true;
  }

  async refreshToken(refreshData: IRefreshData) {
    const deviceTag =
      refreshData.device.system.mobileData ||
      refreshData.device.system.userAgent;

    const userTokenData = await this.tokenService.findTokenAndGet(
      refreshData.refreshToken,
      deviceTag,
    );
    if (!userTokenData.status) {
      return userTokenData;
    }

    const tokens = await this.tokenService.insertTokens(
      userTokenData.userData,
      userTokenData.deviceId,
      null,
    );

    return tokens;
  }
}
