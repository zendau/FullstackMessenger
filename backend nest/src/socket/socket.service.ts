import { Injectable } from '@nestjs/common';
import IUser from './interfaces/IUser';

@Injectable()
export class SocketService {
  public users: IUser[] = [];

  addUser(user: IUser) {
    this.users.push(user);
    console.log('pushed user', this.users);
  }

  getRoomUsers(room) {
    return this.users.filter((item) => item.roomId === room);
  }

  getFreeUsers() {
    return this.users.filter(
      (user) => user.roomId === null || user.roomId === undefined,
    );
  }

  getUserById(id) {
    return this.users.find((user) => user.userId === id);
  }

  clientLeaveRoom(id) {
    this.users.forEach((user) => {
      if (user.userId === id) user.roomId = null;
    });
  }

  clientDisconnect(id) {
    this.users = this.users.filter((user) => user.userId !== id);
  }

  clientJoinRoom(id, roomId) {
    this.users.forEach((user) =>
      user.userId === id ? (user.roomId = roomId) : user,
    );
  }
}
