import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '@/socket/socket.service';

import IMessageData from '@/socket/interfaces/message/IMessageData';
import IMessagePressing from '@/socket/interfaces/message/IMessagePressing';
import IEditMessage from '@/socket/interfaces/message/IEditMessage';
import IReadMessage from '@/socket/interfaces/message/IReadMessage';
import { IDeleteMessage } from '@/socket/interfaces/message/IDeleteMessage';
import { IContactStatus } from '@/socket/interfaces/contact/IContactStatus';
import IChatCreate from '@/chat/interfaces/IChatCreate';
import IChatGroupMember from '@/socket/interfaces/chat/IChatGroupMember';
import IUserPeer from '@/socket/interfaces/user/IUserPeer';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8082, {
  path: '/socketChat',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  private readonly logger = new Logger(SocketGateway.name);
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(socket: Socket) {
    this.logger.log(`user - ${socket.data.userId} disconnect`);

    const userStatus = await this.socketService.clientDisconnect(
      socket.data.userId,
    );

    if (!userStatus) return;
    socket.broadcast.emit('contact', userStatus);
    const rooms = await this.socketService.getUserRoomsIds(userStatus.userId);
    if (!rooms || rooms.length === 0) return;
    socket.broadcast.to(rooms).emit('updateUserOnline', userStatus);
  }

  @SubscribeMessage('connect-user')
  async connectUser(socket: Socket, { userId, peerId }: IUserPeer) {
    this.logger.log(`user - ${userId} connected`);
    const userStatus = this.socketService.addUser(userId, peerId);
    const rooms = await this.socketService.getUserRoomsIds(userId);
    socket.data.userId = userId;
    socket.join(rooms);
    socket.broadcast.emit('contact', userStatus);
    if (!rooms || rooms.length === 0) return;
    socket.broadcast.to(rooms).emit('updateUserOnline', userStatus);
  }

  @SubscribeMessage('invite-user')
  async inviteUserToChat(socket: Socket, payload: IChatGroupMember) {
    const inseredUserData = await this.socketService.inviteUserToChat(payload);

    if (!inseredUserData) {
      this.server
        .to(socket.id)
        .emit('chatSocketError', { message: 'Error when invite a user' });
      return;
    }

    await this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: payload.userLogin,
      type: 'add',
      files: null,
      users: inseredUserData.inseredData.users,
    });

    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (payload.userId === userSocket.data?.userId) {
        userSocket.join(payload.chatId);
      }
    }
    this.server.emit('inviteChatUser', {
      ...inseredUserData,
      adminId: payload.adminId,
    });
  }

  @SubscribeMessage('remove-user')
  async removeUserFromChat(socket: Socket, payload: IChatGroupMember) {
    const userData = await this.socketService.removeUserFromChat(payload);

    if (!userData) {
      this.server
        .to(socket.id)
        .emit('chatSocketError', { message: 'Error when deleting a user' });
      return;
    }

    this.server.to(payload.chatId).emit('removeChatUser', {
      ...userData,
      adminId: payload.adminId,
    });

    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (payload.userId === userSocket.data?.userId) {
        userSocket.leave(payload.chatId);
      }
    }

    await this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: payload.userLogin,
      type: 'remove',
      files: null,
      users: userData.chatUsers,
    });
  }

  @SubscribeMessage('exit-chat')
  async exitUserFromChat(socket: Socket, payload: IChatGroupMember) {
    const userData = await this.socketService.removeUserFromChat(payload);

    if (!userData) {
      this.server
        .to(socket.id)
        .emit('chatSocketError', { message: 'Error when exit from chat' });
      return;
    }

    this.server.to(payload.chatId).emit('removeChatUser', {
      ...userData,
      adminId: payload.adminId,
    });

    socket.leave(payload.chatId);

    await this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: payload.userLogin,
      type: 'exit',
      files: null,
      users: userData.chatUsers,
    });
  }

  @SubscribeMessage('message_pressing')
  handleMessagePressing(socket: Socket, payload: IMessagePressing) {
    console.log('message_pressing', payload);
    socket.broadcast.to(payload.roomId).emit('message_status', payload);
  }

  @SubscribeMessage('delete_messages')
  deleteMessagesHandler(socket: Socket, payload: IDeleteMessage) {
    this.socketService.deleteMessages(payload);
    this.server.to(payload.roomId).emit('updateDeletedMessages', payload);
  }

  @SubscribeMessage('edit_message')
  async editMessageHandler(socket: Socket, payload: IEditMessage) {
    const editedStatus = await this.socketService.editMessage(payload);
    this.server
      .to(payload.roomId)
      .emit('updateMessage', { ...payload, editedStatus });
  }

  @SubscribeMessage('readMessages')
  async readMessagesHandler(socket: Socket, payload: IReadMessage) {
    const unreadCount = await this.socketService.unReadMessages({
      userId: payload.userId,
      chatData: payload.chatData,
      count: payload.count,
    });
    console.log('unreadCount', unreadCount);

    this.server.to(payload.chatData.id).emit('updateReadMessages', unreadCount);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, payload: IMessageData) {
    const isChatDateExist = await this.socketService.isChatDateMessage(
      payload.roomId,
    );

    if (isChatDateExist !== true) {
      await this.sendMessage(socket, {
        roomId: payload.roomId,
        authorId: null,
        authorLogin: null,
        type: 'date',
        text: isChatDateExist,
        files: null,
        users: payload.users,
      });
    }

    const message = await this.socketService.addMessage(payload);
    console.log('MESSAGE', message);
    this.server.to(payload.roomId).emit('newMessage', message);
  }

  @SubscribeMessage('chatContactStatus')
  async chatContactStatus(socket: Socket, payload: IContactStatus) {
    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (userSocket.data?.userId == payload.contactId) {
        console.log('userSocket', userSocket.data, payload);
        console.log(
          '!!!!userSocket.data',
          userSocket.id,
          userSocket.data?.userId,
        );
        console.log(socket.rooms);
        this.server.to(userSocket.id).emit('changeContactStatus', payload);
        break;
      }
    }
  }

  @SubscribeMessage('createChat')
  async createChat(socket: Socket, payload: IChatCreate) {
    console.log('create chat', payload);

    const chatData = await this.socketService.createChat(payload);

    if ('status' in chatData) {
      this.server.to(socket.id).emit('chatSocketError', payload);
    } else {
      for (const userSocket of this.server.sockets.sockets?.values()) {
        if (payload.users.includes(userSocket.data?.userId)) {
          console.log('userSocket.id', userSocket.id);
          userSocket.join(chatData.id);

          if (!chatData.adminId) {
            chatData.title = await this.socketService.getPrivateChatTitle(
              userSocket.data?.userId,
              chatData.users,
            );
          }

          this.server.to(userSocket.id).emit('newChat', chatData);
        }
      }

      if (chatData.adminId) {
        await this.sendMessage(socket, {
          roomId: chatData.id,
          authorId: null,
          authorLogin: null,
          text: null,
          type: 'created',
          files: null,
          users: chatData.users,
        });
      }
    }
  }

  @SubscribeMessage('deleteChat')
  async deleteChatGroup(
    socket: Socket,
    payload: { chatId: string; adminId: number },
  ) {
    const deleteRes = await this.socketService.deleteChat(
      payload.chatId,
      payload.adminId,
    );

    if ('status' in deleteRes) {
      this.server.to(socket.id).emit('chatSocketError', deleteRes);
      return;
    }

    this.server.to(payload.chatId).emit('deletedChatGroup', {
      chatId: payload.chatId,
    });

    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (deleteRes.includes(userSocket.data?.userId)) {
        userSocket.leave(payload.chatId);
      }
    }
  }
}
