import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserAccess } from '../access/access.entity';
import { UserRole } from '../user/user.entity';
import IUserPaginationList from 'src/contacts/interfaces/IUserPaginationList';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserAccess)
    private accessRepository: Repository<UserAccess>,
    private userService: UserService,
  ) {}

  async setUnblock(userId: number) {
    const res = await this.accessRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: false,
      })
      .where('userId = :userId', { userId })
      .execute();
    return !!res.affected;
  }

  async setBlock(userId: number) {
    console.log(userId);
    const res = await this.accessRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: true,
      })
      .where('userId = :userId', { userId })
      .execute();
    return !!res.affected;
  }

  async getAllUsers(listData: IUserPaginationList) {
    const subQuery = await this.usersRepository
      .createQueryBuilder()
      .select('id')
      .orderBy('id');

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      listData.userId,
      false,
      listData.page,
      listData.limit,
      listData.pattern,
    );
    return resList;
  }

  getRolesList() {
    return Array.from(Object.values(UserRole));
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
      .where('id = :userId', { userId })
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
}
