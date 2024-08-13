import {
  Injectable,
  Inject,
  Logger,
  forwardRef,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ChatService } from '@/chat/chat.service';
import { MessageService } from '@/message/message.service';
import IEditMessage from '@/socket/interfaces/message/IEditMessage';
import IMessageData from '@/socket/interfaces/message/IMessageData';
import { SocketRedisAdapter } from '@/socket/socketRedisAdapter.service';
import { UserService } from '@/chat/user.service';
import IChat from '@/chat/interfaces/IChat';
import IChatExtended from '@/socket/interfaces/chat/IChatExtended';
import IUser from '@/chat/interfaces/IUser';
import { Message } from '@/message/entities/message.entity';
import IUserChat from '@/socket/interfaces/user/IUserChat';
import IReadMessage from '@/socket/interfaces/message/IReadMessage';
import IMessageCreated from '@/socket/interfaces/message/IMessageCreated';
import { IDeleteMessage } from '@/socket/interfaces/message/IDeleteMessage';
import IChatCreate from '@/chat/interfaces/IChatCreate';
import { DetailedRpcException } from '@lib/exception';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService,
    private socketRedisAdapter: SocketRedisAdapter,
    @Inject('PEER_SERVICE') private peerServiceClient: ClientProxy,
  ) {}

  async addMessage(messageData: IMessageData) {
    const message: IMessageCreated = {
      ...messageData,
      created_at: new Date(),
      id: new Date().getTime(),
      isEdited: false,
    };

    this.socketRedisAdapter.setHashValue(
      'message',
      messageData.roomId,
      message.id,
      message,
      false,
    );

    if (message.authorId) {
      this.socketRedisAdapter.deleteListValue(
        'hotChats',
        messageData.authorId,
        messageData.roomId,
      );
      this.socketRedisAdapter.shiftList(
        'hotChats',
        messageData.authorId,
        messageData.roomId,
        false,
      );
    }
    messageData.users.forEach((user) => {
      this.socketRedisAdapter.deleteListValue(
        'hotChats',
        user.id,
        messageData.roomId,
      );
      this.socketRedisAdapter.shiftList(
        'hotChats',
        user.id,
        messageData.roomId,
        false,
      );
    });

    if (message.type === undefined || message.type === 'text') {
      await this.addUnReadStatus(messageData.roomId, message.authorId);
    }

    return message;
  }

  async getChatUsers(roomId: string) {
    const chatData = await this.getChatById(roomId);
    return chatData.users;
  }

  async deleteMessages({ roomId, deletedData }: IDeleteMessage) {
    this.socketRedisAdapter.deleteHashManyMessages(
      {
        deleteValuesFromDB: () => this.messageService.removeMany(deletedData),
      },
      {
        roomId,
        deletedData,
      },
    );
  }

  async editMessage(editMessageData: IEditMessage) {
    const messageUpdatedStatus: boolean =
      await this.socketRedisAdapter.editHashValueMessage(
        {
          editValuesFromDB: async () =>
            await this.messageService.update(editMessageData),
        },
        editMessageData,
      );

    return messageUpdatedStatus;
  }

  addUser(userId: number, peerId: string) {
    this.socketRedisAdapter.setValue('online', peerId, false, userId);
    return {
      userId: userId,
      status: 'online',
      peerId,
    };
  }

  async getChatData(userId: number, chatId: string) {
    const chatData = (await this.getChatById(chatId)) as IChatExtended;
    chatData.lastMessage = await this.getLastChatMessage(chatId);

    chatData.users = await this.setUserOnlineStatus(chatData.users as number[]);
    chatData.chatUnread = await this.getUnreadMessagesCount(chatData);

    if (chatData.title === null) {
      chatData.title = await this.getPrivateChatTitle(userId, chatData.users);

      chatData.users = chatData.users.filter((user) => user.id != userId);
    }

    const unreadCount: number = await this.socketRedisAdapter.getValue(
      'unread',
      null,
      userId,
      chatId,
    );

    if (unreadCount) {
      chatData.userUnread = unreadCount;
    } else {
      chatData.userUnread = 0;
    }

    return chatData;
  }

  async getCurrentChatById(userId: number, chatId: string) {
    const checkStatus = await this.socketRedisAdapter.isSetValueExist(
      'userRooms',
      userId,
      chatId,
    );
    if (!checkStatus) return false;

    const chatData = await this.getChatData(userId, chatId);
    return chatData;
  }

  async getCurrentChatRoom(
    userRoomsData: Set<string>,
    userId: number,
    chatId: string,
  ) {
    if (!chatId || userRoomsData.has(chatId)) return;

    const currentTempChatData = await this.getCurrentChatById(userId, chatId);
    return currentTempChatData;
  }

  async getUserRoomsData(userId: number, chatIdList: string[]) {
    const resChatData = new Map<string, IChatExtended>();
    for (const chatId of chatIdList) {
      resChatData.set(chatId, await this.getChatData(userId, chatId));
    }
    return JSON.stringify([...resChatData]);
  }

  async getUnreadMessagesCount(chatData: IChatExtended) {
    const usersUnreadCount: number[] = [];

    if (!chatData.lastMessage) return 0;

    for (const user of Object.values(chatData.users) as IUser[]) {
      const unreadCount: number = await this.socketRedisAdapter.getValue(
        'unread',
        null,
        user.id,
        chatData.id,
      );

      if (chatData.lastMessage.authorId === user.id) continue;

      usersUnreadCount.push(unreadCount);
    }

    if (usersUnreadCount.length === 0) return 0;
    return Math.min(...usersUnreadCount);
  }

  async getLastChatMessage(roomId: string) {
    const lastMessage: Message | undefined =
      await this.socketRedisAdapter.getLastHashValue(
        'message',
        {
          getValuesFromDB: async () =>
            await this.messageService.getLastChatMessage(roomId),
          isExpire: false,
        },
        roomId,
      );

    return lastMessage;
  }

  async getPrivateChatTitle(userId: number, chatUsers: (IUser | number)[]) {
    const filteredUser = chatUsers.filter((user) => {
      if (typeof user === 'number' && user != userId) {
        return user;
      } else if (typeof user !== 'number' && user.id != userId) {
        return user;
      }
      return false;
    })[0];

    if (typeof filteredUser === 'number') {
      const userData = await this.userService.getUserById(filteredUser);
      return userData.login;
    }
    return filteredUser.login;
  }

  async getUserRoomsIds(userId: number) {
    if (!userId) return;

    const userRooms: string[] = await this.socketRedisAdapter.getSetValue(
      'userRooms',
      {
        getValuesFromDB: async () =>
          await this.chatService.getChatsIdList(userId),
        isExpire: true,
      },
      userId,
    );

    return userRooms;
  }

  async setUserOnlineStatus(roomUsers: number[]) {
    const groupUsers = await this.chatService.getUsersListData(roomUsers);

    for (const user of groupUsers) {
      const onlineUserData = await this.socketRedisAdapter.getValue(
        'online',
        null,
        user.id,
      );

      if (onlineUserData) {
        user.lastOnline = 'online';
        user.peerId = onlineUserData;
      }
    }

    return groupUsers;
  }

  async getChatById(chatId: string) {
    const chatData: IChat = await this.socketRedisAdapter.getValue(
      'room',
      {
        getValuesFromDB: async () => await this.chatService.getChatById(chatId),
        isExpire: true,
      },
      chatId,
    );
    return chatData;
  }

  async clientLeaveRoom(userId: number, lastOnline: Date) {
    const userData = await this.userService.getUserById(userId);

    if (!userData || typeof userData === 'string') return;
    userData.lastOnline = lastOnline;
    this.socketRedisAdapter.setValue('user', userData, true, userId);
  }

  async clientDisconnect(userId: number) {
    const lastOnline = new Date();

    this.userService.updateLastOnline(userId, lastOnline);
    this.socketRedisAdapter.deleteValue('online', userId);
    this.clientLeaveRoom(userId, lastOnline);

    return {
      userId,
      status: lastOnline,
    };
  }

  async addUnReadStatus(chatId: string, authorId: number) {
    const users = await this.getChatUsers(chatId);
    users.forEach((userId) => {
      if (userId != authorId) {
        this.readMessageInc(userId, chatId);
      }
    });
  }

  readMessageInc(userId: number, chatId: string) {
    this.socketRedisAdapter.incValue('unread', userId, chatId, 1);
  }

  async unReadMessages({ userId, chatData, count }: IReadMessage) {
    this.socketRedisAdapter.decValue('unread', userId, chatData.id, count);

    return await this.getUnreadMessagesCount(chatData);
  }

  async getFreeChatUsers(chatData: IUserChat) {
    const userContacts: Record<number, IUser> =
      await this.socketRedisAdapter.getManyValues(
        'userContacts',
        chatData.userId,
        true,
        {
          getValuesFromDB: async () =>
            await this.userService.getContactList({
              userId: chatData.userId,
            }),
          isExpire: true,
        },
      );

    if (!userContacts) return [];

    const freeChatUsers: IUser[] = Object.keys(userContacts).reduce(
      (freeUsers, userId) => {
        const isChatUserExist = (
          chatData.users as undefined as string[]
        ).includes(userId);

        if (!isChatUserExist) {
          freeUsers.push(userContacts[userId]);
        }
        return freeUsers;
      },
      [],
    );

    return freeChatUsers;
  }

  async inviteUserToChat(inseredData: IUserChat) {
    const resInsered = await this.chatService.invaiteUsersToChat(inseredData);

    if (!resInsered) return false;

    const roomData = await this.getChatById(inseredData.chatId);

    if (!roomData) return;

    (roomData.users as number[]).push(inseredData.userId);

    this.socketRedisAdapter.setValue(
      'room',
      roomData,
      true,
      inseredData.chatId,
    );

    this.socketRedisAdapter.setSetValue(
      'userRooms',
      inseredData.userId,
      inseredData.chatId,
    );

    this.socketRedisAdapter.shiftList(
      'hotChats',
      inseredData.userId,
      inseredData.chatId,
      false,
    );

    return {
      inseredData,
    };
  }

  async removeUserFromChat(userData: IUserChat) {
    const resDeleted = await this.chatService.exitUserGroup(userData);

    if (!resDeleted) return false;

    const roomData = await this.getChatById(userData.chatId);
    if (!roomData) return;

    let deletedUserInfo: number = null;

    roomData.users = (roomData.users as number[]).filter((userId) => {
      if (userId === userData.userId) {
        deletedUserInfo = userId;

        return false;
      }
      return true;
    });

    this.socketRedisAdapter.setValue('room', roomData, true, userData.chatId);

    this.socketRedisAdapter.deleteSetValue(
      'userRooms',
      userData.userId,
      userData.chatId,
    );

    this.socketRedisAdapter.deleteListValue(
      'hotChats',
      userData.userId,
      userData.chatId,
    );

    return {
      deletedUserInfo,
      userData,
      chatUsers: roomData.users,
    };
  }

  async createChat(chatData: IChatCreate) {
    const res = await this.chatService.createChat(chatData);

    if ('status' in res) return res;

    const createdChatData: IChatExtended = {} as any;
    createdChatData.id = res.id;
    createdChatData.adminId = res.adminId;
    createdChatData.title = res.title;
    createdChatData.chatUnread = 0;
    createdChatData.lastMessage = null;
    createdChatData.userUnread = 0;

    const conferenceCreated = await firstValueFrom(
      this.peerServiceClient.send('room/add', {
        id: res.id,
        withVideo: chatData.conferenceType ?? true,
      }),
    );

    if ('status' in conferenceCreated) return conferenceCreated;

    createdChatData.conferenceWithVideo = conferenceCreated.withVideo;
    createdChatData.users = await this.setUserOnlineStatus(chatData.users);

    createdChatData.users.forEach((user) => {
      this.socketRedisAdapter.setSetValue(
        'userRooms',
        user.id,
        createdChatData.id,
      );
    });

    this.socketRedisAdapter.setValue(
      'room',
      {
        id: createdChatData.id,
        title: createdChatData.title,
        adminId: createdChatData.adminId,
        users: chatData.users,
        conferenceWithVideo: createdChatData.conferenceWithVideo,
      },
      true,
      createdChatData.id,
    );

    return createdChatData;
  }

  async deleteChat(chatId: string, adminId: number) {
    const chatData = await this.getChatById(chatId);

    if (chatData.adminId !== adminId)
      throw new DetailedRpcException(
        ['error.invalidChatAdmin', adminId],
        HttpStatus.FORBIDDEN,
      );

    const usersIdList = [];

    chatData.users.forEach((userId) => {
      this.socketRedisAdapter.deleteListValue('hotChats', userId, chatId);
      this.socketRedisAdapter.deleteSetValue('userRooms', userId, chatId);
      this.socketRedisAdapter.deleteValue('unread', userId, chatId);
      usersIdList.push(userId);
    });

    this.socketRedisAdapter.deleteValue('room', chatId);
    this.socketRedisAdapter.deleteValue('message', chatId);
    this.socketRedisAdapter.deleteValue('map-message', chatId);

    this.chatService.remove(chatId);

    return usersIdList;
  }

  async isChatDateMessage(chatId: string) {
    const isExist = await this.socketRedisAdapter.isListValueExist(
      'chatDate',
      chatId,
    );

    if (isExist !== null) return true;

    const chatDate = new Date().toString();

    this.socketRedisAdapter.setList('chatDate', chatId, false);
    return chatDate;
  }
}
