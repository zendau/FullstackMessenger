import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SocketRedisAdapter } from 'src/socket/socketRedisAdapter.service';
import { firstValueFrom } from 'rxjs';
import IUser from './interfaces/IUser';
import IGetDataError from './interfaces/IGetDataError';

@Injectable()
export class UserService {
  constructor(
    @Inject('AUTH_SERVICE') private authServiceClient: ClientProxy,
    private socketRedisAdapter: SocketRedisAdapter,
  ) {}

  async getFreeUserList(userId: number) {
    const res: IUser[] | IGetDataError = await firstValueFrom(
      this.authServiceClient.send('contact/freeList', userId),
    );

    if ('status' in res) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  async getContacts() {
    const res: IUser[] | IGetDataError = await firstValueFrom(
      this.authServiceClient.send('user/all', ''),
    );

    if ('status' in res) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  async getManyUserByid(idList: number[]) {
    const res: IUser[] | IGetDataError = await firstValueFrom(
      this.authServiceClient.send('user/idList', idList),
    );

    if ('status' in res) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  async getUserById(userId: number) {
    if (!userId) return;

    const userData: IUser = await this.socketRedisAdapter.getValue(
      'user',
      {
        getValuesFromDB: async () => {
          const res = await firstValueFrom(
            this.authServiceClient.send('user/id', userId),
          );
          return res;
        },
        isExpire: true,
      },
      userId,
    );
    return userData;
  }

  async getInvaitedUsers(usersIdList: number[]) {
    const allUsers = await this.getContacts();

    //const ids = usersId.map((id) => parseInt(id));

    const invaitedUsers = allUsers.filter(
      (userData) => usersIdList.indexOf(userData.id) === -1,
    );

    return invaitedUsers;
  }

  async updateLastOnline(userId: number, lastOnline: Date) {
    const res: boolean | IGetDataError = await firstValueFrom(
      this.authServiceClient.send('user/updateLastOnline', {
        userId,
        lastOnline,
      }),
    );

    if (typeof res === 'boolean') return res;
    else throw new HttpException(res.message, res.httpCode);
  }
}
