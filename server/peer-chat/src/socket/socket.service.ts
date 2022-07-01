import { Injectable } from '@nestjs/common';
import IUser from './interfaces/IUser';

@Injectable()
export class SocketService {
  public users: IUser[] = [];

  addUser(user: IUser) {
    this.users.push(user);
  }

  getRoomUsers(room) {
    return this.users.filter((item) => item.roomId === room);
  }

  getFreeUsers() {
    console.log(
      '```',
      this.users,
      this.users.filter(
        (user) => user.roomId === null || user.roomId === undefined,
      ),
    );
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

  clientJoinRoom(id, roomId, peerId) {
    this.users.forEach((user) => {
      if (user.userId === id) {
        user.roomId = roomId;
        user.peerId = peerId;
        user.mute = false;
        user.pause = false;
      }
    });
  }

  changeMuteStatus(id) {
    this.users = this.users.map((item) => {
      if (item.userId === id) {
        item.mute = !item.mute;
      }
      return item;
    });
  }

  changeVideoPause(id) {
    this.users = this.users.map((item) => {
      if (item.userId === id) {
        item.pause = !item.pause;
      }
      return item;
    });
  }
}
