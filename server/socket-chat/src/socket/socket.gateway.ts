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
    console.log('client disconected');
    debugger;
    const userId = this.socketService.clientDisconnect(socket.id);
    const rooms = this.socketService.getUserRooms(userId);
    const roomUser = this.socketService.updateUserRoomsOnline(userId);
    this.server.to(rooms).emit('getUsers', roomUser);
  }

  @SubscribeMessage('connect-user')
  connectEvent(socket: Socket, payload) {
    console.log('conntect', payload);
    debugger;
    this.socketService.addUser(payload);

    const rooms = this.socketService.getUserRooms(payload.userId);
    socket.join(rooms);
    const roomUser = this.socketService.updateUserRoomsOnline(payload.userId);
    this.server.to(rooms).emit('getUsers', roomUser);
    //this.server.emit('getOnlineUsers', this.socketService.getOnlineUsers());
  }

  // @SubscribeMessage('invite-user')
  // inviteUserToRoom(@MessageBody() payload: any) {
  //   this.server.emit('userInviteRoom', payload);
  // }

  @SubscribeMessage('message_pressing')
  handleMessagePressing(
    socket: Socket,
    payload: { userName: string; roomId: string },
  ) {
    socket.broadcast
      .to(payload.roomId)
      .emit('message_status', payload.userName);
  }

  @SubscribeMessage('userLeave')
  userLeaveChatGroup(socket: Socket, payload: IUserJoin) {
    console.log('PAYLOAD', payload);
    socket.broadcast.to(payload.roomId).emit('updateUserCount', payload.userId);
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
