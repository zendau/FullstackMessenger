import { Injectable } from '@nestjs/common';
import IUser from './interfaces/IUser';

@Injectable()
export class SocketService {
  private users: IUser[] = [];

  addUser(user: IUser) {
    this.users.push(user);
  }

  getRoomUser(room) {
    return this.users.filter((item) => item.roomId === room);
  }

  getUserById(id) {
    return this.users.find((user) => user.userId === id);
  }

  userLeaveChat(id) {
    this.users = this.users.filter((user) => user.userId !== id);
  }
}
