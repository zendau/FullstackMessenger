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

  getOnlineUsers() {
    return this.users;
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
    this.users.forEach((user) => {
      if (user.userId === id) {
        user.roomId = roomId;
      }
    });
  }
}
