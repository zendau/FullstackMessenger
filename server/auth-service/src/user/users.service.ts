import { ConfirmCodeService } from '../confirm/confirm-status/confirm-status.service';
import { NodeMailerService } from './../confirm/nodemailer/nodemailer.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../token/token.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, QueryRunner } from 'typeorm';
import { User } from './users.entity';

import IUser from './interfaces/IUserData';
import IUserLogin from './interfaces/IUserLogin';
import IRoleData from './interfaces/IRoleData';

import convertUserDTO from './assets/createUserDTO';
import { comparePassword, equalPasswords, hashPassword } from './assets/passwordWorker';

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

  async register(userData: IUser): Promise<any> {

    const resCheckEmail = await this.checkEmail(userData.email);
    if (!resCheckEmail.status) return resCheckEmail;

    const resCheckPasswords = await equalPasswords(
      userData.password,
      userData.confirmPassword,
    );
    if (!resCheckPasswords.status) return resCheckPasswords;

    const hashedPassword = await hashPassword(userData.password);

    const userEntity = this.usersRepository.create();
    userEntity.email = userData.email;
    userEntity.password = hashedPassword;
    userEntity.login = userData.login;

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const resUserInsered = await this.queryRunner.manager.save(User, userEntity);
      const role = await this.roleService.getRoleById(
        parseInt(process.env.BASE_USER_ROLE_ID),
      );
    
      const tokens = await this.insertInTransaction(resUserInsered, {
        id: role.id,
        name: role.value,
        accessLevel: role.accessLevel
      });

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

    const resComparePasswords = await comparePassword(
      userData.password,
      resUserData.userData.password,
    );

    if (!resComparePasswords.status) {
      return resComparePasswords;
    }

    const { activateStatus, role }  = await this.getAdditionalUserData(resUserData.userData.id)

    const tokens = this.insertTokens(
      {
        ...convertUserDTO(resUserData.userData),
        role: {
          roleId: role.id,
          roleName: role.value,
          roleAccess: role.accessLevel
        },
        isActivate: activateStatus
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

    const { activateStatus, role }  = await this.getAdditionalUserData(userCheck.userData.id)

    const tokens = this.insertTokens(
      {
        ...convertUserDTO(userCheck.userData),
        role: {
          roleId: role.id,
          roleName: role.value,
          roleAccess: role.accessLevel
        },
        isActivate: activateStatus
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



  private async getAdditionalUserData(userId: number) {
    const role = await this.roleService.getRoleById(userId);
    const activateStatus = await this.confirmCodeService.getActivateStatus(userId);

    return {
      role,
      activateStatus
    }
  }

  private async insertTokens(toketData, manager: any) {
    const tokens = await this.tokenService.generateTokens(toketData);
    await this.tokenService.saveToken(
      toketData.id,
      tokens.refreshToken,
      manager,
    );
    return tokens;
  }

  private async insertInTransaction(userData: User, roleData: IRoleData) {
    await this.roleService.addUserRole(
      {
        roleId: roleData.id,
        userId: userData.id,
      },
      this.queryRunner.manager,
    );

    const confirmStatus = await this.confirmCodeService.createStatus(userData, this.queryRunner.manager);

    return await this.insertTokens(
      {
        ...convertUserDTO(userData),
        role: {
          roleId: roleData.id,
          roleName: roleData.name,
          roleAccess: roleData.accessLevel
        },
        isActivate: confirmStatus.isActivate
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
