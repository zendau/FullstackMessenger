import { Injectable } from '@nestjs/common';

interface IUser {
  roomId: string;
  userId: string;
}

@Injectable()
export class AppService {
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
