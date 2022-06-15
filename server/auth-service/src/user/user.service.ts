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
import { comparePassword, equalPasswords, hashPassword } from './assets/passwordWorker';
import { Cache } from 'cache-manager';

import convertEditUserDTO from './assets/createEditUserDTO';
import { sqlErrorCodes } from './assets/sqlErrorCodes';
import IEditUser from './interfaces/IEditUserData';

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
    private connection: Connection,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  async register(userData: IUser): Promise<any> {
    const checkCode = await this.confirmCodeService.checkConfirmCode(userData.confirmCode, userData.email);

    if (!checkCode.status) {
      return checkCode
    }

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
        value: role.value,
        accessLevel: role.accessLevel
      });

      await this.queryRunner.commitTransaction();
      await this.confirmCodeService.deleteConfirmCode(userData.email);
      return tokens;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      console.log('e', e)
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
      const resUserData = await this.findByEmail(userData.email);
      if (!resUserData.status) return resUserData;

      const resComparePasswords = await comparePassword(
        userData.password,
        resUserData.userData.password,
      );

      if (!resComparePasswords.status) {
        return resComparePasswords;
      }

      const bannedStatus = await this.confirmCodeService.getBannedStatus(resUserData.userData.id);

      const tokens = this.insertTokens(
        {
          ...convertUserDTO(resUserData.userData),
          isBanned: bannedStatus.isBanned
        },
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

  async editUserData(userData: IEditUser) {
    debugger
    try {
      const checkCode = await this.confirmCodeService.checkConfirmCode(userData.confirmCode, userData.email);
      if (!checkCode.status) {
        return checkCode
      }

      const oldUserData :any = await this.getUserById(userData.id);

      if (oldUserData.email !== userData.email) {
        throw new Error()
      }


      if (userData.password !== undefined) {

        const resCheckPasswords = await equalPasswords(
          userData.password,
          userData.confirmPassword,
        );
        if (!resCheckPasswords.status) return resCheckPasswords;

        const hashedPassword = await hashPassword(userData.password);

        userData.password = hashedPassword

      }


      const updatedUserData = convertEditUserDTO(userData);


      const statusUpdated = await this.usersRepository
        .createQueryBuilder()
        .update()
        .set(updatedUserData)
        .where('id = :id', { id: userData.id })
        .execute();


      if (!statusUpdated.affected) {
        throw new Error()
      }

      return true

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
      }
    }

  }


  async resetUserPassword(userData: IUser) {
    debugger
    const checkCode = await this.confirmCodeService.checkConfirmCode(userData.confirmCode, userData.email);

    if (!checkCode.status) {
      return checkCode
    }

    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await hashPassword(newPassword);

    const statusUpdated = await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        password: hashedPassword
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

  async refreshToken(refreshToken: string) {
    debugger
    const userTokenData = await this.tokenService.findTokenAndGet(refreshToken);
    if (!userTokenData.status) {
      return userTokenData;
    }

    const userCheck = await this.findByEmail(userTokenData.userData.email);

    if (!userCheck.status) {
      return userCheck;
    }

    const { bannedStatus, role } = await this.getAdditionalUserData(userCheck.userData.id, userCheck.userData.role.id);

    const tokens = this.insertTokens(
      {
        ...convertUserDTO(userCheck.userData),
        role: {
          roleId: role.id,
          roleName: role.value,
          roleAccess: role.accessLevel
        },
        isBanned: bannedStatus
      },
      null,
    );

    return tokens;
  }

  private async findByEmail(email: string) {
    const user: any = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.password', 'r.id', 'r.value', 'r.desc'])
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



  private async getAdditionalUserData(userId: number, roleId: number) {
    console.log('roleId', roleId)
    const role = await this.roleService.getRoleById(roleId);
    console.log('role', role)
    const bannedStatus = await this.confirmCodeService.getBannedStatus(userId);

    return {
      role,
      bannedStatus
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

    const accessData = await this.confirmCodeService.initAcceesNote(userData, this.queryRunner.manager);

    return await this.insertTokens(
      {
        ...convertUserDTO(
          Object.assign(userData, {
            role: {
              id: roleData.id,
              value: roleData.value,
              accessLevel: roleData.accessLevel
            }
          })),
        isBanned: accessData.isBanned
      },
      this.queryRunner.manager,
    );

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
