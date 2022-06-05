import { ConfirmCodeService } from '../confirm/confirm-status/confirm-status.service';
import { NodeMailerService } from './../confirm/nodemailer/nodemailer.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../token/token.service';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, QueryRunner } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import IUser from './interfaces/IUserData';
import IUserLogin from './interfaces/IUserLogin';
import IUserDTO from './dto/user.dto';
import e from 'express';
import IRoleData from './interfaces/IRoleData';

@Injectable()
export class UsersService {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tokenService: TokenService,
    private roleService: RoleService,
    private nodeMailerService: NodeMailerService,
    private confirmCodeService: ConfirmCodeService,
    private connection: Connection,
  ) { }

  async register(userData: IUser, typeStatus: boolean): Promise<any> {

    const resCheckEmail = await this.checkEmail(userData.email);
    if (!resCheckEmail.status) return resCheckEmail;

    const resCheckPasswords = await this.equalPasswords(
      userData.password,
      userData.confirmPassword,
    );
    if (!resCheckPasswords.status) return resCheckPasswords;

    const hashPassword = await this.hashPassword(userData.password);

    const userEntity = this.usersRepository.create();
    userEntity.email = userData.email;
    userEntity.password = hashPassword;
    userEntity.login = userData.login;

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const resInsered = await this.queryRunner.manager.save(User, userEntity);
      let tokens;
      debugger;
      if (!typeStatus) {
        //tokens = await this.insertInTransaction(resInsered, userData.roleId);
      } else {
        const role = await this.roleService.getRoleByName(
          process.env.BASE_USER_ROLE,
        );
        tokens = await this.insertInTransaction(resInsered, {
          id: role.id,
          name: role.value,
          accessLevel: role.accessLevel
        });
      }
      await this.queryRunner.commitTransaction();
      return tokens;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      return {
        status: false,
        message: e.message,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  async login(userData: IUserLogin) {
    const resUserData = await this.findByEmail(userData.email);
    if (!resUserData.status) return resUserData;
    debugger;
    const resComparePasswords = await this.comparePassword(
      userData.password,
      resUserData.userData.password,
    );

    if (!resComparePasswords.status) {
      return resComparePasswords;
    }

    const tokens = this.saveTokens(
      {
        ...resUserData.userData,
        role: resUserData.userData.roleId,
      },
      null,
    );

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    const userTokenData = await this.tokenService.findTokenAndGet(refreshToken);
    if (!userTokenData.status) {
      return userTokenData;
    }

    const userCheck = await this.findByEmail(userTokenData.userData.email);

    if (!userCheck.status) {
      return userCheck;
    }

    const tokens = this.saveTokens(
      {
        ...userTokenData.userData,
      },
      null,
    );

    return tokens;
  }

  private async checkEmail(email: string) {
    const user = await this.usersRepository.find({
      where: {
        email,
      },
    });

    if (user.length === 0) {
      return {
        status: true,
      };
    }
    return {
      status: false,
      message: `Email - ${email} is already registered`,
      httpCode: HttpStatus.BAD_REQUEST,
    };
  }

  private async findByEmail(email: string) {
    const user: any = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.password', 'r.id', 'r.value', 'r.desc'])
      .innerJoinAndSelect('u.roleId', 'ur')
      .innerJoinAndSelect('ur.role', 'r')
      .where('u.email = :email', { email })
      .getOne();

    if (user !== undefined) {
      user.roleId = user.roleId[0].role;
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

  private async equalPasswords(password: string, confirmPassword: string) {
    if (password === confirmPassword)
      return {
        status: true,
      };
    else
      return {
        status: false,
        message: `password and confirm password is not equals`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
  }

  private async comparePassword(password: string, hash: string) {
    const resCompare = await bcrypt.compare(password, hash);

    if (!resCompare)
      return {
        status: false,
        message: `Password is wrong`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return {
      status: true,
    };
  }

  private convertUserDTO(userData: User) {
    return {
      id: userData.id,
      email: userData.email,
      login: userData.login,
    };
  }

  private async saveTokens(toketData, manager: any) {
    const tokens = await this.tokenService.generateTokens(toketData);
    await this.tokenService.saveToken(
      toketData.id,
      tokens.refreshToken,
      manager,
    );
    return tokens;
  }

  private async insertInTransaction(userData: User, roleData: IRoleData) {
    const userRoleData = await this.roleService.addUserRole(
      {
        roleId: roleData.id,
        userId: userData.id,
      },
      this.queryRunner.manager,
    );

    console.log('role', userRoleData);
    const confirmStatus = await this.confirmCodeService.createStatus(userData, this.queryRunner.manager);


    return await this.saveTokens(
      {
        ...this.convertUserDTO(userData),
        role: {
          roleId: roleData.id,
          roleName: roleData.name,
          roleAccess: roleData.accessLevel
        },
        confirm: {
          confrimCode: confirmStatus.confirmCode,
          isActivate: confirmStatus.isActivate
        }
      },
      this.queryRunner.manager,
    );

  }

  async getAllUsers() {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.login'])
      .getMany();

    return users;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.login'])
      .where('user.id = :id', { id })
      .getOne();
    console.log(user);
    await this.confirmCodeService.activateAccount(user.id);
    return user;
  }

  async test() {
    const res = await this.nodeMailerService.test()
    return res;
  }
}
