import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import IUser from './interfaces/IUser';
import IUserJoin from './interfaces/IUserJoin';

@Injectable()
export class SocketService {
  constructor(
    private chatService: ChatService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.getUsers();
  }

  // TODO: аменить на папрос к chat.service
  //public users: IUser[] = [];
  public users = new Map();
  public onlineUsers = new Map([
    [
      '1',
      {
        login: 'one',
        room: 'test',
      },
    ],
  ]);

  getUsers() {
    const values = new Map([
      ['1', { login: 'one', lastOnline: '5 min ago' }],
      [
        '2',
        {
          login: 'two',
          lastOnline: '10 min ago',
        },
      ],
      [
        '3',
        {
          login: 'three',
          lastOnline: '15 min ago',
        },
      ],
    ]);

    this.users.set('test', values);
  }

  addUser(user) {
    this.onlineUsers.set(user.userId, user.userData);
    console.log('pushed user', this.onlineUsers, user);
  }

  getRoomUsers(room) {
    //return this.users.filter((item) => item.roomId === room);
    const roomUsers = this.users.get(room);
    console.log('room', roomUsers, room, this.users);
    return Object.fromEntries(this.getOnlineUsers(roomUsers).entries());
  }

  getOnlineUsers(users) {
    for (const userId of users.keys()) {
      debugger;
      if (this.onlineUsers.has(userId)) {
        const updatedData = users.get(userId);
        updatedData.lastOnline = 'online';
        console.log('updatedData', updatedData);
        users.set(userId, updatedData);
      }
    }

    console.log('test', users);
    return users;
  }

  getUserById(id) {
    return this.onlineUsers[id];
  }

  clientLeaveRoom(userData: IUserJoin) {
    this.onlineUsers.delete(userData.userId);

    const data = this.users.get(userData.roomId);
    const updatedData = data.get(userData.userId);
    updatedData.lastOnline = 'offline ' + new Date();
    data.set(userData.userId, updatedData);
    this.users.set(userData.roomId, data);
  }

  clientDisconnect(id) {
    //this.users = this.users.filter((user) => user.userId !== id);
  }

  clientJoinRoom(id, roomId) {
    const userData = this.onlineUsers.get(id);
    this.users.get(roomId).set(id, userData);
    console.log('join room', this.users, userData);
  }
}
