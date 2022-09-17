import { Message } from './../message/entities/message.entity';
import { MessageService } from './../message/message.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

import { HttpException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import IUserConnect from './interfaces/IUserConnect';
import IUserJoin from './interfaces/IUserJoin';
import IMessageData from './interfaces/IMessageData';

@WebSocketGateway(80, {
  path: '/socketChat',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(socket: Socket) {
    const userData = this.socketService.getUserById(socket.id);

    if (userData !== undefined) {
      this.socketService.clientDisconnect(socket.id);
      const roomUsers = this.socketService.getRoomUsers(userData.roomId);
      console.log('romUsers', roomUsers);
      this.server.to(userData.roomId).emit('getUsers', roomUsers);
      this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
    }
  }

  @SubscribeMessage('connect-user')
  connectEvent(@MessageBody() payload: IUserConnect) {
    this.socketService.addUser(payload);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  // @SubscribeMessage('invite-user')
  // inviteUserToRoom(@MessageBody() payload: any) {
  //   this.server.emit('userInviteRoom', payload);
  // }

  @SubscribeMessage('join-room')
  handleMessage(socket: Socket, payload: IUserJoin) {
    this.socketService.clientJoinRoom(payload.userId, payload.roomId);

    socket.join(payload.roomId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  @SubscribeMessage('userLeave')
  userLeaveChatGroup(socket: Socket, payload: IUserJoin) {
    socket.broadcast.to(payload.roomId).emit('updateUserCount', payload.userId);
  }

  @SubscribeMessage('exit-room')
  roomEvent(socket: Socket, payload: IUserJoin) {
    this.socketService.clientLeaveRoom(payload.userId);
    socket.leave(payload.roomId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: IMessageData) {
    const res = await this.messageService.create(
      {
        authorLogin: payload.authorLogin,
        text: payload.text,
        chatId: payload.chatId,
      },
      payload.files,
    );

    if (res?.media) {
      res.files = await this.messageService.setFilesDataToMessage(res.media);
    }
    if ('chat' in res) {
      this.server.to(payload.chatId).emit('newMessage', {
        authorLogin: res.authorLogin,
        text: res.text,
        created_at: res.created_at,
        id: res.id,
        files: res.files,
      });
    }
  }
}
