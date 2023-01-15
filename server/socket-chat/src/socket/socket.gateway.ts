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
import IChatPagination from './interfaces/chat/IChatPagination';
import IChatSearch from './interfaces/chat/IChatSearch';
import IUserChat from './interfaces/user/IUserChat';
import IMessagePressing from './interfaces/message/IMessagePressing';
import IChatMessages from './interfaces/chat/IChatMessages';
import IEditMessage from './interfaces/message/IEditMessage';
import IReadMessage from './interfaces/message/IReadMessage';
import IUserData from './interfaces/user/IUserData';
import { IDeleteMessage } from './interfaces/message/IDeleteMessage';
import { IContactStatus } from './interfaces/contact/IContactStatus';
import IChatCreate from 'src/chat/interfaces/IChatCreate';

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
    console.log('joined rooms', rooms);
    socket.data.userId = userId;
    socket.join(rooms);
    socket.broadcast.to(rooms).emit('updateUserOnline', userStatus);
  }

  // API
  // @SubscribeMessage('get-chats')
  // async getChats(socket: Socket, payload: IChatLoad) {
  //   const userRoomsData = await this.socketService.getUserRoomsData(
  //     payload.userId,
  //     0,
  //     payload.limit,
  //   );

  //   const currentTempChatData = await this.socketService.getCurrentChatRoom(
  //     userRoomsData.roomsData,
  //     payload.userId,
  //     payload.chatId,
  //   );

  //   this.server
  //     .to(socket.id)
  //     .emit('getRoomsData', { ...userRoomsData, currentTempChatData });
  // }

  // API
  // @SubscribeMessage('load-chats')
  // async loadChatsPage(socket: Socket, payload: IChatPagination) {
  //   //const rooms = await this.socketService.getUserRooms(payload.userId);
  //   const userRoomsData = await this.socketService.getUserRoomsData(
  //     payload.userId,
  //     payload.page,
  //     payload.limit,
  //   );
  //   this.server.to(socket.id).emit('appendRoomsData', userRoomsData);
  // }

  // API
  // @SubscribeMessage('serchChats')
  // async getChatsByPattern(socket: Socket, payload: IChatSearch) {
  //   const userRoomsData = await this.socketService.getChatsByPattern(
  //     payload.userId,
  //     payload.pattern,
  //   );
  //   this.server.to(socket.id).emit('getChatsByPattern', userRoomsData);
  // }

  // API
  // @SubscribeMessage('load-chat-by-id')
  // async loadChatById(socket: Socket, payload: IUserChat) {
  //   const currentChatData = await this.socketService.getCurrentChatById(
  //     payload.userId,
  //     payload.chatId,
  //   );

  //   this.server.to(socket.id).emit('appendRoomData', {
  //     chatId: payload.chatId,
  //     data: currentChatData,
  //   });
  // }

  @SubscribeMessage('invite-user')
  async inviteUserToChat(socket: Socket, payload: IUserChat) {
    debugger;
    const inseredUserData = await this.socketService.inviteUserToChat(payload);

    if (!inseredUserData) return inseredUserData;

    this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: `Added ${inseredUserData.userData.login}`,
      files: null,
      users: inseredUserData.inseredData.users,
    });

    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (payload.userId === userSocket.data?.userId) {
        userSocket.join(payload.chatId);
      }
    }
    this.server.emit('inviteChatUser', inseredUserData);
  }

  @SubscribeMessage('remove-user')
  async removeUserFromChat(socket: Socket, payload: IUserChat) {
    const userData = await this.socketService.removeUserFromChat(payload);
    this.server.to(payload.chatId).emit('removeChatUser', userData);

    if (!userData) return;

    for (const userSocket of this.server.sockets.sockets?.values()) {
      if (payload.userId === userSocket.data?.userId) {
        userSocket.leave(payload.chatId);
      }
    }

    this.sendMessage(socket, {
      roomId: payload.chatId,
      authorId: null,
      authorLogin: null,
      text: `Deleted ${userData.deletedUserInfo.login}`,
      files: null,
      users: userData.chatUsers,
    });
  }

  @SubscribeMessage('message_pressing')
  handleMessagePressing(socket: Socket, payload: IMessagePressing) {
    socket.broadcast.to(payload.roomId).emit('message_status', payload);
  }

  // API
  // @SubscribeMessage('getRoomMessages')
  // async getRoomMessagesHandler(socket: Socket, payload: IChatMessages) {
  //   const messagesData = await this.socketService.getRoomMessages(payload);
  //   this.server.to(socket.id).emit('upload_messages', messagesData);
  // }

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
      chatId: payload.chatId,
      count: payload.count,
    });

    this.server.to(payload.chatId).emit('updateReadMessages', unreadCount);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, payload: IMessageData) {
    debugger;
    console.log('new message', payload);
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

  // API
  // @SubscribeMessage('getFreeChatUsers')
  // async getFreeChatUsers(socket: Socket, payload: IUserChat) {
  //   const freeUsers = await this.socketService.getFreeChatUsers(
  //     payload.chatId,
  //     payload.userId,
  //   );

  //   this.server.to(socket.id).emit('getFreeChatContacts', freeUsers);
  // }

  // API
  // @SubscribeMessage('getContactData')
  // async getContactData(socket: Socket, payload: IUserChat) {
  //   const contactData = await this.socketService.getContactData(payload);

  //   this.server.to(socket.id).emit('contactData', contactData);
  // }

  @SubscribeMessage('chatContactStatus')
  async chatContactStatus(socket: Socket, payload: IContactStatus) {
    for (const userSocket of this.server.sockets.sockets?.values()) {
      console.log('userSocket', userSocket.data, payload);

      if (userSocket.data?.userId == payload.contactId) {
        console.log('!!!!userSocket.data', userSocket.id);
        this.server.to(userSocket.id).emit('changeContactStatus', payload);
      }
    }
  }

  @SubscribeMessage('createChat')
  async createChat(socket: Socket, payload: IChatCreate) {
    console.log('create chat', payload);

    const chatData = await this.socketService.createChat(payload);

    if ('status' in chatData) {
      console.log('ERROR', chatData);
      this.server.to(socket.id).emit('chatCreateError', payload);
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

          this.server
            .to(userSocket.id)
            .emit('newChat', { [chatData.id]: chatData });
        }
      }

      if (chatData.adminId) {
        this.sendMessage(socket, {
          roomId: chatData.id,
          authorId: null,
          authorLogin: null,
          text: 'Created',
          files: null,
          users: chatData.users,
        });
      }
    }
  }
}
