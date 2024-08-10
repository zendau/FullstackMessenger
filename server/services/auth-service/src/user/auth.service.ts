import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, QueryRunner } from 'typeorm';
import { randomBytes } from 'crypto';

import { ConfirmCodeService } from '@/access/access-confirm/access-confirm';
import { NodeMailerService } from '@/access/nodemailer/nodemailer.service';
import { TokenService } from '@/token/token.service';
import { User } from '@/user/user.entity';
import { comparePassword, hashPassword } from '@/utils/passwordFactory';
import { UserService } from '@/user/user.service';
import { UserInfoService } from '@/user/userInfo.service';
import convertUserDTO from '@/user/dto/createUserDTO';
import { IDevice } from '@/token/interfaces/ITokenDevice';
import IRefreshData from '@/user/interfaces/IRefreshData';
import IUserData from './interfaces/IUserData';

@Injectable()
export class AuthService {
  private queryRunner: QueryRunner;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tokenService: TokenService,
    private userService: UserService,
    private nodeMailerService: NodeMailerService,
    private confirmCodeService: ConfirmCodeService,
    private userInfoService: UserInfoService,
    private connection: Connection,
  ) {}

  async register(userData: IUserData) {
    const checkCode = await this.confirmCodeService.checkConfirmCode(
      userData.confirmCode,
      userData.email,
    );

    if (!checkCode.status) {
      return checkCode;
    }

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

      const tokens = await this.userRegisterTransaction(
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
        message: 'error.wrongCredentials',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  async checkEmail(email: string) {
    try {
      const resUserData = await this.userService.findByEmail(email);
      if (resUserData.status)
        return {
          find: true,
          message: ['error.takenEmail', email],
        };
      return {
        find: false,
        message: ['error.undefinedEmail', email],
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async login(userData: IUserData) {
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
        await this.userService.getAdditionalUserData(resUserData.userData.id);

      const tokens = await this.tokenService.insertTokens(
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
      this.logger.error(e.message);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  private async userRegisterTransaction(userData: User, deviceData: IDevice) {
    const accessData = await this.confirmCodeService.initAcceesNote(
      userData,
      this.queryRunner.manager,
    );

    const userInfo = await this.userInfoService.add(
      { userId: userData.id },
      this.queryRunner.manager,
    );

    const tokens = await this.tokenService.insertTokens(
      {
        ...convertUserDTO(userData),
        info: userInfo,
        isBanned: accessData.isBanned,
      },
      deviceData,
      this.queryRunner.manager,
    );

    return tokens;
  }

  async resetUserPassword(userData: IUserData) {
    const checkCode = await this.confirmCodeService.checkConfirmCode(
      userData.confirmCode,
      userData.email,
    );

    if (!checkCode.status) {
      return checkCode;
    }

    const newPassword = randomBytes(4).toString('hex');

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
        message: 'error.invalidResetData',
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
      refreshData.device,
      null,
    );

    return tokens;
  }
}
