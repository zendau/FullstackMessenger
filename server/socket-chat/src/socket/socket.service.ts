import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import IChatMessages from './interfaces/chat/IChatMessages';
import IEditMessage from './interfaces/message/IEditMessage';
import IMessageData from './interfaces/message/IMessageData';
import { SocketRedisAdapter } from './socketRedisAdapter.service';
import { UserService } from 'src/chat/user.service';
import IChat from 'src/chat/interfaces/IChat';
import IChatExtended from './interfaces/chat/IChatExtended';
import IUser from 'src/chat/interfaces/IUser';
import { Message } from 'src/message/entities/message.entity';
import IChatPaginationData from './interfaces/chat/IChatPaginationData';
import IUserChat from './interfaces/user/IUserChat';
import IReadMessage from './interfaces/message/IReadMessage';
import IMessageCreated from './interfaces/message/IMessageCreated';
import { IDeleteMessage } from './interfaces/message/IDeleteMessage';
import IChatCreate from 'src/chat/interfaces/IChatCreate';

// interface userData {
//   login: string;
//   lastOnline: string;
// }

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService,
    private socketRedisAdapter: SocketRedisAdapter,
  ) {
    // this.getUsers();
    //this.socketRedisAdapter.setValues('user', this.users);
    //this.socketRedisAdapter.setSetMany('userRooms', this.userRooms);
    //this.socketRedisAdapter.setSetMany('userContacts', this.userContacts);
    //this.socketRedisAdapter.setValues('online', this.onlineUsers, false);
    // for (const userId in this.users) {
    //   this.redis.set(`user:${userId}`, JSON.stringify(this.users[userId]));
    // }
    // for (const userRooms in this.userRooms) {
    //   this.redis.rpush(`userRooms:${userRooms}`, this.userRooms[userRooms]);
    // }
    // for (const userContacts in this.userContacts) {
    //   this.redis.rpush(
    //     `userContacts:${userContacts}`,
    //     this.userContacts[userContacts],
    //   );
    // }
    //this.test();
    // for (const user in this.onlineUsers) {
    //   this.redis.set(`online:${user}`, this.onlineUsers[user]);
    // }
  }
  // async test() {
  //   console.log(
  //     'test1 - exist',
  //     await this.userRoomExist('ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de', 'test'),
  //   );
  //   console.log(
  //     'test1 - exist',
  //     await this.userRoomExist(
  //       'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de',
  //       '0b250a1e-3d77-4825-ace9-34df33c6d282',
  //     ),
  //   );
  // }
  //public rooms: IUser[] = [];
  // public users = {
  //   'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de': {
  //     login: 'one',
  //     lastOnline: '5 min ago',
  //   },
  //   '0cbc7a56-5139-4feb-9bfd-ce8f549a1510': {
  //     login: 'two',
  //     lastOnline: '10 min ago',
  //   },
  //   '2d1db9d3-5051-4ada-9573-c0d76b7fad89': {
  //     login: 'three',
  //     lastOnline: '15 min ago',
  //   },
  //   'db824aa2-0d44-4b94-aee4-7c3f58d846a5': {
  //     login: 'four',
  //     lastOnline: '20 min ago',
  //   },
  // };

  // public userRooms = {
  //   'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de': [
  //     'f76733fb-f387-458b-89a4-76a00e4622be',
  //     '0b250a1e-3d77-4825-ace9-34df33c6d282',
  //     '8866e214-cbe5-427b-a370-9bfa201a4af0',
  //     'a44df7c2-ed06-4226-9442-f265da22762b',
  //     'daf49b93-07ba-4926-82c3-c0b1ba5059a5',
  //     '5802229d-96c9-4fb3-b7f0-9a87e1e0a59c',
  //     'dd5b3f46-44f0-4ed6-89c5-8e1db6d3cb22',
  //     '8d4fc7cb-06d1-429a-9dd7-bd9c6768da3a',
  //     '71ebfde8-6abd-4fe6-ae0c-d17d187274c1',
  //     '4f87d798-231a-4dbe-8618-634843e1cc16',
  //     '2bf8581e-3a2a-42e9-bdfa-c3efadbbe2d7',
  //     'fddc14b1-215f-4d69-ad4d-fb0a009e7eb3',
  //   ],
  //   '0cbc7a56-5139-4feb-9bfd-ce8f549a1510': [
  //     'f76733fb-f387-458b-89a4-76a00e4622be',
  //     '0b250a1e-3d77-4825-ace9-34df33c6d282',
  //     '6cd13731-9504-4ae8-b4c6-a47109fc37a4',
  //     '8866e214-cbe5-427b-a370-9bfa201a4af0',
  //     'a44df7c2-ed06-4226-9442-f265da22762b',
  //     'daf49b93-07ba-4926-82c3-c0b1ba5059a5',
  //     '5802229d-96c9-4fb3-b7f0-9a87e1e0a59c',
  //     'dd5b3f46-44f0-4ed6-89c5-8e1db6d3cb22',
  //     '8d4fc7cb-06d1-429a-9dd7-bd9c6768da3a',
  //     '71ebfde8-6abd-4fe6-ae0c-d17d187274c1',
  //     '4f87d798-231a-4dbe-8618-634843e1cc16',
  //     '2bf8581e-3a2a-42e9-bdfa-c3efadbbe2d7',
  //     'fddc14b1-215f-4d69-ad4d-fb0a009e7eb3',
  //   ],
  //   '2d1db9d3-5051-4ada-9573-c0d76b7fad89': [
  //     'f76733fb-f387-458b-89a4-76a00e4622be',
  //     '6cd13731-9504-4ae8-b4c6-a47109fc37a4',
  //     '8866e214-cbe5-427b-a370-9bfa201a4af0',
  //     'a44df7c2-ed06-4226-9442-f265da22762b',
  //     'daf49b93-07ba-4926-82c3-c0b1ba5059a5',
  //     '5802229d-96c9-4fb3-b7f0-9a87e1e0a59c',
  //     'dd5b3f46-44f0-4ed6-89c5-8e1db6d3cb22',
  //     '8d4fc7cb-06d1-429a-9dd7-bd9c6768da3a',
  //     '71ebfde8-6abd-4fe6-ae0c-d17d187274c1',
  //     '4f87d798-231a-4dbe-8618-634843e1cc16',
  //     '2bf8581e-3a2a-42e9-bdfa-c3efadbbe2d7',
  //     'fddc14b1-215f-4d69-ad4d-fb0a009e7eb3',
  //   ],
  //   'db824aa2-0d44-4b94-aee4-7c3f58d846a5': [
  //     '0b250a1e-3d77-4825-ace9-34df33c6d282',
  //   ],
  // };
  // public rooms = {};
  // public messages = {};
  // public readMessages = {};

  // // Values is socketId
  // public onlineUsers = {
  //   'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de': 'test',
  // };

  // public userContacts = {
  //   '0cbc7a56-5139-4feb-9bfd-ce8f549a1510': [
  //     'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de',
  //     '2d1db9d3-5051-4ada-9573-c0d76b7fad89',
  //     'db824aa2-0d44-4b94-aee4-7c3f58d846a5',
  //   ],
  //   '2d1db9d3-5051-4ada-9573-c0d76b7fad89': [
  //     '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //     'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de',
  //     'db824aa2-0d44-4b94-aee4-7c3f58d846a5',
  //   ],
  // };

  // async userRoomExist(userId: string, roomId: string) {
  //   const userRoom = await this.redis.lpos(`userRooms:${userId}`, roomId);
  //   return !!userRoom;
  // }

  addMessage(messageData: IMessageData) {
    // if (this.messages.hasOwnProperty(room)) {
    //   this.messages[room].push(message);
    // } else {
    //   this.messages[room] = [message];
    // }
    //

    const message: IMessageCreated = {
      authorId: messageData.authorId,
      authorLogin: messageData.authorLogin,
      text: messageData.text,
      created_at: new Date(),
      id: new Date().getTime(),
      files: messageData.files,
      roomId: messageData.roomId,
      isEdited: false,
    };

    this.socketRedisAdapter.setHashValue(
      'message',
      messageData.roomId,
      message.id,
      message,
      false,
    );

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

    //this.redis.rpush(`message:${room}`, JSON.stringify(message));
    this.addUnReadStatus(messageData.roomId, message.authorId);
    return message;
  }

  // async getRoomMessages(scrollData: IChatMessages) {
  //   //
  //   // const messagesKeys = await this.socketRedisAdapter.getBranchesSubKeys(
  //   //   'message',
  //   //   roomId,
  //   // );
  //
  //   let roomMessages: Message[] = [];

  //   if (scrollData.inMemory) {
  //     const takeLength = scrollData.page * scrollData.limit;

  //     roomMessages = await this.socketRedisAdapter.getHashes(
  //       'message',
  //       null,
  //       scrollData.chatId,
  //       takeLength,
  //       takeLength + scrollData.limit,
  //     );

  //     if (roomMessages?.length >= scrollData.limit)
  //       return {
  //         messages: roomMessages,
  //         page: scrollData.page + 1,
  //         limit: scrollData.limit,
  //         inMemory: true,
  //         hasMore: true,
  //       };
  //     scrollData.page = 0;
  //   }

  //   const roomDbMessages = await this.messageService.getAllByChat(
  //     scrollData.chatId,
  //     scrollData.page,
  //     scrollData.limit,
  //   );

  //   if (roomMessages?.length <= scrollData.limit) {
  //     roomDbMessages.unshift(...roomMessages);
  //   }

  //   return {
  //     messages: roomDbMessages,
  //     page: scrollData.page + 1,
  //     limit: scrollData.limit,
  //     inMemory: false,
  //     hasMore: roomDbMessages.length >= scrollData.limit,
  //   };
  //   //this.logger.debug(`get room messages - `, roomMessages);

  //   // if (this.messages.hasOwnProperty(room)) {
  //   //   return this.messages[room];
  //   // } else {
  //   //   return [];
  //   // }
  // }

  // getUsers() {
  // const values1 = {
  //   isAdmin: '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //   title: 'Group one',
  //   users: [
  //     'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de',
  //     '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //     '2d1db9d3-5051-4ada-9573-c0d76b7fad89',
  //   ],
  // };
  // const values2 = {
  //   isAdmin: '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //   title: 'Group two',
  //   users: [
  //     'ca5b24bb-3c5f-42db-bc2c-ce5dd0d1b9de',
  //     '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //     'db824aa2-0d44-4b94-aee4-7c3f58d846a5',
  //   ],
  // };
  // const values3 = {
  //   isAdmin: null,
  //   title: null,
  //   users: [
  //     '0cbc7a56-5139-4feb-9bfd-ce8f549a1510',
  //     '2d1db9d3-5051-4ada-9573-c0d76b7fad89',
  //   ],
  // };
  // this.rooms['f76733fb-f387-458b-89a4-76a00e4622be'] = values1;
  // this.rooms['0b250a1e-3d77-4825-ace9-34df33c6d282'] = values2;
  // this.rooms['6cd13731-9504-4ae8-b4c6-a47109fc37a4'] = values3;
  // this.rooms['8866e214-cbe5-427b-a370-9bfa201a4af0'] = values1;
  // this.rooms['a44df7c2-ed06-4226-9442-f265da22762b'] = values1;
  // this.rooms['daf49b93-07ba-4926-82c3-c0b1ba5059a5'] = values1;
  // this.rooms['5802229d-96c9-4fb3-b7f0-9a87e1e0a59c'] = values1;
  // this.rooms['dd5b3f46-44f0-4ed6-89c5-8e1db6d3cb22'] = values1;
  // this.rooms['8d4fc7cb-06d1-429a-9dd7-bd9c6768da3a'] = values1;
  // this.rooms['71ebfde8-6abd-4fe6-ae0c-d17d187274c1'] = values1;
  // this.rooms['4f87d798-231a-4dbe-8618-634843e1cc16'] = values1;
  // this.rooms['2bf8581e-3a2a-42e9-bdfa-c3efadbbe2d7'] = values1;
  // this.rooms['fddc14b1-215f-4d69-ad4d-fb0a009e7eb3'] = values1;
  //this.socketRedisAdapter.setValues('room', this.rooms);
  // for (const roomId in this.rooms) {
  //   this.redis.set(`room:${roomId}`, JSON.stringify(this.rooms[roomId]));
  //   // this.redis.set(
  //   //   `room:${roomId}`,
  //   //   JSON.stringify(this.rooms[roomId]),
  //   //   'EX',
  //   //   20,
  //   // );
  // }
  // }

  async getChatUsers(roomId: string) {
    const chatData = await this.getChatById(roomId);
    return chatData.users;
    //return Object.keys(this.rooms[roomId].users);
  }

  async deleteMessages({ roomId, deletedData }: IDeleteMessage) {
    //
    this.socketRedisAdapter.deleteHashManyMessages(
      {
        deleteValuesFromDB: () => this.messageService.removeMany(deletedData),
      },
      {
        roomId,
        deletedData,
      },
    );

    // if (!isRead) return;

    // const keys = await this.socketRedisAdapter.getBranchesMainKeys(
    //   'unread',
    //   roomId,
    // );
    // this.socketRedisAdapter.deleteValues('unread', roomId, keys);

    // this.messages[room] = this.messages[room].filter(
    //   (message) => !idList.includes(message.id),
    // );
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

    // messageData.isEdited = true;
    // messageData.text = updatedText;

    // this.socketRedisAdapter.setValue(
    //   'message',
    //   messageData,
    //   false,
    //   roomId,
    //   messageId,
    // );
    // const roomMessages = this.messages[messageData.roomId];
    // roomMessages.forEach((message) => {
    //   if (message.id === messageData.messageId) {
    //     message.text = messageData.updatedText;
    //     message.isEdited = true;
    //   }
    // });
    // return true;
  }

  addUser(userId: number) {
    this.socketRedisAdapter.setSetValue('online', userId, false);
    //this.onlineUsers[user.userId] = socketId;
    return {
      userId: userId,
      status: 'online',
    };
  }

  // getRoomUsers(room) {
  //   //return this.rooms.filter((item) => item.roomId === room);
  //   const roomUsers = this.rooms[room];
  //   console.log('room', roomUsers, room, this.rooms);
  //   return this.getOnlineUsers(roomUsers);
  // }

  // getChatsPagination({ page, limit }: { page: number; limit: number }) {
  //   const start = page * limit;
  //   const end = start + limit;
  //   let hasMore = true;

  //   const roomsData = userRooms.slice(start, end);
  //   if (roomsData.length !== limit) {
  //     hasMore = false;
  //   }

  //   return {
  //     roomsData,
  //     hasMore,
  //   };
  // }

  // checkUserExistsInRoom(userId: string, chatId: string) {
  //   if (
  //     this.userRooms.hasOwnProperty(userId) &&
  //     this.userRooms[userId].includes(chatId)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  async getChatData(userId: number, chatId: string) {
    // const chatData = JSON.parse(
    //   JSON.stringify(this.getRoomDataWithOnlineStatus(this.rooms[chatId])),
    // );
    const chatData = (await this.getChatById(chatId)) as IChatExtended;
    chatData.chatUnread = await this.getUnreadMessagesCount(
      chatId,
      chatData.users,
    );

    chatData.users = await this.setUserOnlineStatus(chatData.users);

    // chatData.users = await this.socketRedisAdapter.getManyValues(
    //   'user',
    //   chatData.users,
    //   false,
    //   async () => await this.chatService.getManyUserByid(chatData.users),
    // );

    if (chatData.title === null) {
      chatData.title = await this.getPrivateChatTitle(userId, chatData.users);

      chatData.users = chatData.users.filter((user) => user.id != userId);
    }
    chatData.lastMessage = await this.getLastChatMessage(chatId);

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

    // if (
    //   this.readMessages.hasOwnProperty(userId) &&
    //   this.readMessages[userId].hasOwnProperty(chatId)
    // ) {
    //   chatData.unread = this.readMessages[userId][chatId];
    // } else {
    //   chatData.unread = 0;
    // }

    return chatData;
  }

  async getCurrentChatById(userId: number, chatId: string) {
    // const checkStatus = this.checkUserExistsInRoom(userId, chatId);

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
    // const chatsPagination = await this.chatService.getChatPagination({
    //   page,
    //   limit,
    //   userId,
    // });
    const resChatData = new Map<string, IChatExtended>();
    for (const chatId of chatIdList) {
      resChatData.set(chatId, await this.getChatData(userId, chatId));
      //const roomData = await this.socketRedisAdapter.getValue('room', chatId);
      // const userRooms = await this.socketRedisAdapter.getSet(
      //   'userRooms',
      //   userId,
      // );
      // if (roomData.users.includes(userId) && userRooms.includes(chatId)) {
      //   resData[chatId] = this.getChatData(userId, chatId);
      // }
      // if (roomData.users.includes(userId)) {
      // }
    }
    return resChatData;
  }

  // async getChatsByPattern(userId, idList: string[]) {
  //   const resChatData: IChatPaginationData = {};
  //   for (const chatId of idList) {
  //     resChatData[chatId] = await this.getChatData(userId, chatId);
  //   }
  //   return resChatData;
  // }

  async getUnreadMessagesCount(roomId: string, roomUsers?: IUser[]) {
    //const roomUsers = Object.keys(this.rooms[roomId].users);

    if (!roomUsers) {
      roomUsers = await this.getChatUsers(roomId);
    }

    //const readMessages = await this.socketRedisAdapter.getValue('unread');
    //const usersUnreadCount: number[] = [];
    const usersUnreadCount = await Promise.all(
      roomUsers.map(async (user) => {
        const unreadCount: number = await this.socketRedisAdapter.getValue(
          'unread',
          null,
          user.id,
          roomId,
        );
        if (unreadCount > 0) return unreadCount;
        return 0;
      }),
    );
    // roomUsers.forEach((user) => {
    //   if (this.readMessages[user]?.hasOwnProperty(roomId)) {
    //     usersUnreadCount.push(this.readMessages[user][roomId]);
    //   }
    // });

    //if (usersUnreadCount.length === 0) return 0;
    return Math.min(...usersUnreadCount);
  }

  async getLastChatMessage(roomId: string) {
    //
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
    // if (this.messages.hasOwnProperty(roomId)) {
    //   return this.messages[roomId].at(-1);
    // }
  }

  async getPrivateChatTitle(userId: number, chatUsers: (IUser | number)[]) {
    console.log('chatUsers', chatUsers);
    // const filteredUserId = (
    //   Object.keys(chatUsers) as unknown as Array<keyof typeof chatUsers>
    // ).filter((id) => {
    //   if (id !== userId) {
    //     return id;
    //   }
    // })[0];

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
    // const userData = await this.userService.getUserById(filteredUser.id);
    // return userData.login;
    return filteredUser.login;
  }

  async getUserRoomsIds(userId: number) {
    if (!userId) return;

    // const rooms = [
    //   'f76733fb-f387-458b-89a4-76a00e4622be',
    //   '0b250a1e-3d77-4825-ace9-34df33c6d282',
    //   '6cd13731-9504-4ae8-b4c6-a47109fc37a4',
    //   'two',
    //   '8866e214-cbe5-427b-a370-9bfa201a4af0',
    //   'a44df7c2-ed06-4226-9442-f265da22762b',
    //   'daf49b93-07ba-4926-82c3-c0b1ba5059a5',
    //   '5802229d-96c9-4fb3-b7f0-9a87e1e0a59c',
    //   'dd5b3f46-44f0-4ed6-89c5-8e1db6d3cb22',
    //   '8d4fc7cb-06d1-429a-9dd7-bd9c6768da3a',
    //   '71ebfde8-6abd-4fe6-ae0c-d17d187274c1',
    //   '4f87d798-231a-4dbe-8618-634843e1cc16',
    //   '2bf8581e-3a2a-42e9-bdfa-c3efadbbe2d7',
    //   'fddc14b1-215f-4d69-ad4d-fb0a009e7eb3',
    // ];
    //
    const userRooms = await this.socketRedisAdapter.getSetValue(
      'userRooms',
      {
        getValuesFromDB: async () =>
          await this.chatService.getChatsIdList(userId),
        isExpire: true,
      },
      userId,
    );
    // const userRooms = rooms.filter((room) =>
    //   this.userRooms[userId]?.includes(room),
    // );
    // const userRooms = await this.chatService.getChatsIdList(userId);
    return userRooms;
  }

  async setUserOnlineStatus(roomUsers: IUser[]) {
    for (const user of roomUsers) {
      const onlineStatus = await this.socketRedisAdapter.isSetValueExist(
        'online',
        null,
        user.id,
      );
      console.log('ONLINE', onlineStatus, user);
      if (onlineStatus) {
        user.lastOnline = 'online';
      }
    }

    //console.log('test', rooms);
    return roomUsers;
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
    if (!userData) return;
    userData.lastOnline = lastOnline;
    this.socketRedisAdapter.setValue('user', userData, true, userId);

    // for (const room in this.rooms) {
    //   if (this.rooms[room].users.hasOwnProperty(userId)) {
    //     this.rooms[room].users[userId].lastOnline = lastOnline;
    //   }
    // }
  }

  async clientDisconnect(userId: number) {
    const lastOnline = new Date();

    this.userService.updateLastOnline(userId, lastOnline);
    this.socketRedisAdapter.deleteSetValue('online', null, userId);
    this.clientLeaveRoom(userId, lastOnline);

    return {
      userId,
      status: `offilen - ${lastOnline}`,
    };

    //this.rooms = this.rooms.filter((user) => user.userId !== id);
  }

  async addUnReadStatus(chatId: string, authorId: number) {
    const users = await this.getChatUsers(chatId);
    users.forEach((user) => {
      // TODO: добавить строгуй проверку !== при переходе на jwt id
      if (user.id != authorId) {
        this.readMessageInc(user.id, chatId);
      }
    });
  }

  readMessageInc(userId: number, chatId: string) {
    // if (!this.readMessages[userId]) {
    //   this.readMessages[userId] = {};
    // }
    this.socketRedisAdapter.incValue('unread', userId, chatId, 1);

    // if (!this.readMessages[userId][chatId]) {
    //   this.readMessages[userId][chatId] = 1;
    //   //this.redis.set(`unread:${userId}:${chatId}`, 1);
    // } else {
    //   this.readMessages[userId][chatId]++;
    //   //this.redis.incr(`unread:${userId}:${chatId}`);
    // }
  }

  async unReadMessages({ userId, chatId, count }: IReadMessage) {
    // if (!this.readMessages[userId]) {
    //   this.readMessages[userId] = {};
    // }
    this.socketRedisAdapter.decValue('unread', userId, chatId, count);

    // if (!this.readMessages[userId][chatId]) {
    //   this.readMessages[userId][chatId] = 0;
    // } else {
    //   this.readMessages[userId][chatId] -= count;
    // }

    return await this.getUnreadMessagesCount(chatId);
  }

  async getFreeChatUsers(chatId: string, userId: number) {
    // if (
    //   !this.rooms.hasOwnProperty(chatId) ||
    //   !this.userContacts.hasOwnProperty(userId)
    // ) {
    //   return [];
    // }
    const userContacts: IUser[] = await this.socketRedisAdapter.getManyValues(
      'userContacts',
      userId,
      true,
      {
        getValuesFromDB: async () =>
          await this.userService.getFreeUserList(userId),
        isExpire: true,
      },
    );
    const chatUsers = await this.getChatUsers(chatId);

    if (!userContacts || !chatUsers) return [];

    //const chatUsers = Object.keys(this.rooms[chatId].users);

    const freeChatUsers: IUser[] = userContacts.reduce(
      (freeUsers, userData) => {
        const isChatUserExist = chatUsers.some(
          (user) => user.id === userData.id,
        );

        if (!isChatUserExist) {
          freeUsers.push(userData);
        }
        return freeUsers;
      },
      [],
    );

    // const freeUsers = await userContacts.reduce(
    //   async (usersDataPromise, userId) => {
    //     const usersData = await usersDataPromise;
    //     if (!chatUsers.includes(userId)) {
    //       usersData[userId] = await this.getUserById(userId);
    //     }
    //     return usersData;
    //   },
    //   Promise.resolve({}),
    // );

    return freeChatUsers;
  }

  async inviteUserToChat(inseredData: IUserChat) {
    // if (
    //   !this.rooms.hasOwnProperty(userData.chatId) ||
    //   !this.users.hasOwnProperty(userData.userId)
    // )
    //   return;
    const resInsered = await this.chatService.invaiteUsersToChat(inseredData);

    if (!resInsered) return false;

    const roomData = await this.getChatById(inseredData.chatId);

    const userData = await this.userService.getUserById(inseredData.userId);

    if (!roomData || !userData) return;

    roomData.users.push(userData);

    this.socketRedisAdapter.setValue(
      'room',
      roomData,
      true,
      inseredData.chatId,
    );
    return {
      inseredData,
      userData,
    };
  }

  async removeUserFromChat(userData: IUserChat) {
    const resDeleted = await this.chatService.exitUserGroup(userData);

    if (!resDeleted) return false;

    const roomData = await this.getChatById(userData.chatId);
    if (!roomData) return;

    let deletedUserInfo: IUser = null;

    roomData.users = roomData.users.filter((user) => {
      if (user.id === userData.userId) {
        deletedUserInfo = user;

        return false;
      }
      return true;
    });

    this.socketRedisAdapter.setValue('room', roomData, true, userData.chatId);

    return {
      deletedUserInfo,
      userData,
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

    const groupUsers = await this.chatService.getUsersListData(chatData.users);
    createdChatData.users = await this.setUserOnlineStatus(groupUsers);

    return createdChatData;
  }
}
