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
  //public rooms: IUser[] = [];
  public rooms = {};
  public onlineUsers = {
    '1': {
      login: 'one',
      room: 'test',
    },
  };

  getUsers() {
    const values = {
      '1': { login: 'one', lastOnline: '5 min ago' },
      '2': {
        login: 'two',
        lastOnline: '10 min ago',
      },
      '3': {
        login: 'three',
        lastOnline: '15 min ago',
      },
    };

    this.rooms['test'] = values;
  }

  addUser(user) {
    this.onlineUsers[user.userId] = user.userData;
    console.log('pushed user', this.onlineUsers, user);
  }

  // getRoomUsers(room) {
  //   //return this.rooms.filter((item) => item.roomId === room);
  //   const roomUsers = this.rooms[room];
  //   console.log('room', roomUsers, room, this.rooms);
  //   return this.getOnlineUsers(roomUsers);
  // }

  updateUserRoomsOnline(userId) {
    //return this.rooms.filter((item) => item.roomId === room);
    debugger;
    for (const room in this.rooms) {
      if (this.rooms[room].hasOwnProperty(userId)) {
        this.getOnlineUsers(this.rooms[room]);
      }
    }

    return this.rooms;
  }

  getUserRooms(userId) {
    // Запрос в редис, если нет запрос к бд
    return ['test', 'one', 'two'];
  }

  getOnlineUsers(rooms) {
    for (const room in rooms) {
      if (this.onlineUsers.hasOwnProperty(room)) {
        rooms[room].lastOnline = 'online';
      }
    }

    console.log('test', rooms);
    return rooms;
  }

  // getUserById(id) {
  //   return this.onlineUsers[id];
  // }

  clientLeaveRoom(userId) {
    const lastOnline = 'offline ' + new Date();

    for (const room in this.rooms) {
      if (this.rooms[room].hasOwnProperty(userId)) {
        this.rooms[room][userId].lastOnline = lastOnline;
      }
    }
  }

  clientDisconnect(id) {
    for (const userId in this.onlineUsers) {
      if (this.onlineUsers[userId].socketId === id) {
        delete this.onlineUsers[userId];
        this.clientLeaveRoom(userId);
        return userId;
      }
    }

    //this.rooms = this.rooms.filter((user) => user.userId !== id);
  }

  // clientJoinRoom(id, roomId) {
  //   const userData = this.onlineUsers[id];
  //   this.rooms[roomId][id] = userData;
  //   console.log('join room', this.rooms, userData);
  // }
}
