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

import * as uuid from 'uuid';

import { HttpException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import IUserConnect from './interfaces/message/IMessagePressing';
import IUserJoin from './interfaces/user/IUserChat';
import IMessageData from './interfaces/message/IMessageData';
import IUserConnectData from './interfaces/chat/IChatLoad';
import IChatPagination from './interfaces/chat/IChatPagination';
import IChatSearch from './interfaces/chat/IChatSearch';
import IUserChat from './interfaces/user/IUserChat';
import IMessagePressing from './interfaces/message/IMessagePressing';
import IChatMessages from './interfaces/chat/IChatMessages';
import IDeleteMessage from './interfaces/message/IDeleteMessage';
import IEditMessage from './interfaces/message/IEditMessage';
import IReadMessage from './interfaces/message/IReadMessage';
import IUserData from './interfaces/user/IUserData';
import IChatLoad from './interfaces/chat/IChatLoad';

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

  async handleDisconnect(socket: Socket) {
    const userStatus = await this.socketService.clientDisconnect(
      socket.data.userId,
    );

    if (!userStatus) return;
    const rooms = await this.socketService.getUserRoomsIds(userStatus.userId);
    if (!rooms || rooms.length === 0) return;
    socket.broadcast.to(rooms).emit('updateUserOnline', userStatus);
  }

  @SubscribeMessage('connect-user')
  async connectUser(socket: Socket, userId: number) {
    const userStatus = this.socketService.addUser(userId);
    const rooms = await this.socketService.getUserRoomsIds(userId);
    socket.data.userId = userId;
    socket.join(rooms);
    socket.broadcast.to(rooms).emit('updateUserOnline', userStatus);
  }

  @SubscribeMessage('get-chats')
  async getChats(socket: Socket, payload: IChatLoad) {
    const userRoomsData = await this.socketService.getUserRoomsData(
      payload.userId,
      0,
      payload.limit,
    );

    const currentTempChatData = await this.socketService.getCurrentChatRoom(
      userRoomsData.roomsData,
      payload.userId,
      payload.chatId,
    );

    this.server
      .to(socket.id)
      .emit('getRoomsData', { ...userRoomsData, currentTempChatData });
  }

  @SubscribeMessage('load-chats-pagination')
  async loadChatsPage(socket: Socket, payload: IChatPagination) {
    //const rooms = await this.socketService.getUserRooms(payload.userId);
    const userRoomsData = await this.socketService.getUserRoomsData(
      payload.userId,
      payload.page,
      payload.limit,
    );
    this.server.to(socket.id).emit('appendRoomsData', userRoomsData);
  }

  @SubscribeMessage('serchChats')
  async getChatsByPattern(socket: Socket, payload: IChatSearch) {
    const userRoomsData = await this.socketService.getChatsByPattern(
      payload.userId,
      payload.pattern,
    );
    this.server.to(socket.id).emit('getChatsByPattern', userRoomsData);
  }

  @SubscribeMessage('load-chat-by-id')
  async loadChatById(socket: Socket, payload: IUserChat) {
    const currentChatData = await this.socketService.getCurrentChatById(
      payload.userId,
      payload.chatId,
    );

    this.server.to(socket.id).emit('appendRoomData', {
      chatId: payload.chatId,
      data: currentChatData,
    });
  }

  @SubscribeMessage('invite-user')
  async inviteUserToChat(socket: Socket, payload: IUserChat) {
    const inseredUserData = await this.socketService.inviteUserToChat(payload);
    this.server.emit('inviteChatUser', inseredUserData);

    if (!inseredUserData) return inseredUserData;

    this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: `Added ${inseredUserData.userData.login}`,
      files: null,
    });
  }

  @SubscribeMessage('remove-user')
  async removeUserFromChat(socket: Socket, payload: IUserChat) {
    const userData = await this.socketService.removeUserFromChat(payload);
    this.server.to(payload.chatId).emit('removeChatUser', userData);

    if (!userData) return;

    this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: `Deleted ${userData.deletedUserInfo.login}`,
      files: null,
    });
  }

  @SubscribeMessage('message_pressing')
  handleMessagePressing(socket: Socket, payload: IMessagePressing) {
    socket.broadcast.to(payload.roomId).emit('message_status', payload);
  }

  @SubscribeMessage('getRoomMessages')
  async getRoomMessagesHandler(socket: Socket, payload: IChatMessages) {
    const messagesData = await this.socketService.getRoomMessages(payload);
    this.server.to(socket.id).emit('upload_messages', messagesData);
  }

  @SubscribeMessage('delete_messages')
  deleteMessagesHandler(socket: Socket, payload: IDeleteMessage) {
    this.socketService.deleteMessages(payload);
    this.server.to(payload.roomId).emit('updateDeletedMessages', payload);
  }

  @SubscribeMessage('edit_message')
  async editMessageHandler(socket: Socket, payload: IEditMessage) {
    debugger;
    const editedStatus = await this.socketService.editMessage(payload);
    this.server
      .to(payload.roomId)
      .emit('updateMessage', { ...payload, editedStatus });
  }

  @SubscribeMessage('readMessages')
  async readMessagesHandler(socket: Socket, payload: IReadMessage) {
    const unreadCount = await this.socketService.unReadMessages({
      userId: payload.userId,
      chatId: payload.chatId,
      count: payload.count,
    });

    this.server.to(payload.chatId).emit('updateReadMessages', unreadCount);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, payload: IMessageData) {
    // const res = await this.messageService.create(
    //   {
    //     authorLogin: payload.authorLogin,
    //     text: payload.text,
    //     chatId: payload.chatId,
    //   },
    //   payload.files,
    // );
    // if (res?.media) {
    //   res.files = await this.messageService.setFilesDataToMessage(res.media);
    // }
    // if ('chat' in res) {
    //   this.server.to(payload.chatId).emit('newMessage', {
    //     authorLogin: res.authorLogin,
    //     text: res.text,
    //     created_at: res.created_at,
    //     id: res.id,
    //     files: res.files,
    //   });
    // }

    const message = this.socketService.addMessage(payload);
    this.server.to(payload.roomId).emit('newMessage', message);
  }

  @SubscribeMessage('getFreeChatUsers')
  async getFreeChatUsers(socket: Socket, payload: IUserChat) {
    const freeUsers = await this.socketService.getFreeChatUsers(
      payload.chatId,
      payload.userId,
    );

    this.server.to(socket.id).emit('getFreeChatContacts', freeUsers);
  }
}
