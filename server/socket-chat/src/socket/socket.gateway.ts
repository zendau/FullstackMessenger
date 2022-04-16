import { Message } from './../message/entities/message.entity';
import { MessageService } from './../message/message.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

import * as uuid from 'uuid';
import axios from 'axios';
import { HttpException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('user connected');
  }

  handleDisconnect(socket: Socket) {
    console.log('user disconnected');

    const userData = this.socketService.getUserById(socket.id);
    console.log('userData', userData, socket.id);

    if (userData !== undefined) {
      this.socketService.clientDisconnect(socket.id);
      const roomUsers = this.socketService.getRoomUsers(userData.roomId);
      console.log('romUsers', roomUsers);
      this.server.to(userData.roomId).emit('getUsers', roomUsers);
      this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
    }
  }

  @SubscribeMessage('connect-user')
  connectEvent(socket: Socket, payload: any) {
    console.log('test', payload);
    this.socketService.addUser(payload);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  @SubscribeMessage('invite-user')
  inviteUserToRoom(socket: Socket, payload: any) {
    console.log('test', payload);
    this.server.emit('userInviteRoom', payload);
  }

  @SubscribeMessage('join-room')
  handleMessage(socket: Socket, payload: any) {
    console.log('start test section', payload, this.socketService.users);

    this.socketService.clientJoinRoom(payload.userId, payload.roomId);
    console.log('end test section');

    console.log('user-connected', payload);
    console.log('before', socket.rooms);
    socket.join(payload.roomId);
    console.log('after', socket.rooms);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    console.log('join', roomUser, payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  @SubscribeMessage('exit-room')
  roomEvent(socket: Socket, payload: any) {
    console.log('exit-room', payload);
    this.socketService.clientLeaveRoom(payload.userId);
    socket.leave(payload.roomId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    console.log('exit', roomUser, this.socketService.users);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, payload: any) {
    console.log('sendMessage', payload);
    console.log('send rooms', socket.rooms);
    const res = await this.messageService.create(
      {
        authorLogin: payload.authorLogin,
        text: payload.text,
        chatId: payload.chatId,
      },
      payload.files,
    );
    // TODO : Удалить запрос на получение данныъ о файле и добавить в микросервисе запрос на получение данных о файлах из другого микросервиса
    // TEMP AREA

    if (res?.media) {
      res.files = await Promise.all(
        res.media.map(async (file) => {
          const res = await firstValueFrom(
            this.fileServiceClient.send('file/get', file),
          );
          console.log('RES', res);
          if (res.status === false) {
            throw new HttpException(res.message, res.httpCode);
          }
          return res;
        }),
      );
      console.log('MESSAGE', res.files);
    }
    // TEMP AREA
    if ('chat' in res) {
      console.log('SEND', payload.chatId);
      this.server.to(payload.chatId).emit('newMessage', {
        authorLogin: res.authorLogin,
        text: res.text,
        created_at: res.created_at,
        id: res.id,
        files: res.files,
      });
    } else {
      console.log('NOT INSTANCEOF');
    }
  }
}
