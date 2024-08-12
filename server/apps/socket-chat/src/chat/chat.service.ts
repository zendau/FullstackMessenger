import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { Chat } from '@/chat/entities/chat.entity';
import { ChatUsers } from '@/chat/entities/chatUsers.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from '@/message/entities/message.entity';
import { SocketRedisAdapter } from '@/socket/socketRedisAdapter.service';
import IChat from '@/chat/interfaces/IChat';
import { UserService } from '@/chat/user.service';
import IChatPagination from '@/socket/interfaces/chat/IChatPagination';
import IUserChat from '@/socket/interfaces/user/IUserChat';
import IChatCreate from '@/chat/interfaces/IChatCreate';
import IGetContactList from '@/chat/interfaces/IGetContactList';
import { SocketService } from '@/socket/socket.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
    private userService: UserService,
    @Inject(forwardRef(() => SocketService))
    private socketService: SocketService,
    private socketRedisAdapter: SocketRedisAdapter,
    @Inject('PEER_SERVICE') private peerServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
    private connection: Connection,
  ) {}

  async getChatsIdList(userId: number) {
    const listData: { chatId: string }[] = await this.chatUserRepository
      .createQueryBuilder()
      .select('chatId')
      .where('userId = :userId', { userId })
      .getRawMany();

    const idList: string[] = listData.map((item) => item.chatId);
    return idList;
  }

  async getChatPagination({
    page,
    limit,
    userId,
    chatId,
    inMemory,
  }: IChatPagination) {
    const chatIdList = new Set<string>();
    let paginationPage = parseInt(page);
    const paginationLimit = parseInt(limit);
    let inMemoryData: boolean = JSON.parse(inMemory);

    if (inMemoryData) {
      const start = paginationPage * paginationLimit;
      const idList = await this.socketRedisAdapter.getListRange(
        'hotChats',
        userId,
        start,
        start + (paginationLimit - 1),
      );

      if (idList.length < paginationLimit) {
        inMemoryData = false;
        paginationPage = 0;
      }

      idList.forEach((id) => chatIdList.add(id));
    }

    if (!inMemoryData) {
      const start = paginationPage * paginationLimit;
      const listPaginationData = await this.chatRepository
        .createQueryBuilder('chat')
        .addSelect(
          (qb) =>
            qb
              .select('max(m.created_at)')
              .from(Message, 'm')
              .where('m.chatId = chatUsers.chatId'),
          'ord',
        )
        .innerJoin('chat.chatUsers', 'chatUsers')
        .where('chatUsers.userId = :userId', { userId })
        .orderBy('ord', 'DESC')
        .skip(start)
        .take(paginationLimit)
        .getMany();

      listPaginationData.forEach((item) => chatIdList.add(item.id));
    }

    const chatsData = await this.socketService.getUserRoomsData(
      userId,
      Array.from(chatIdList),
    );

    const currentTempChatData = await this.socketService.getCurrentChatRoom(
      chatIdList,
      userId,
      chatId,
    );

    return {
      roomsData: chatsData,
      hasMore: chatIdList.size >= paginationLimit,
      page: paginationPage + 1,
      limit,
      inMemory: inMemoryData,
      ...(currentTempChatData && { currentTempChatData }),
    };
  }

  async getChatById(id: string) {
    const res = (await this.chatRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne()) as unknown as IChat;
    if (res === undefined)
      return {
        status: false,
        message: 'error.notFoundChat',
        httpCode: HttpStatus.BAD_REQUEST,
      };

    try {
      const resGetGroupUsers = await this.getGroupUsers(res.id);
      res.users = resGetGroupUsers;

      res.conferenceWithVideo = await firstValueFrom(
        this.peerServiceClient.send('room/getByChat', id),
      );
      return res;
    } catch (e) {
      console.log('e', e);
      this.logger.error(e.message);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createChat(chatData: IChatCreate) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const chatInseted = await queryRunner.manager.save(Chat, {
        adminId: chatData?.adminId,
        title: chatData?.groupName,
      });

      const foulderData = await firstValueFrom(
        this.fileServiceClient.send('foulder/add', chatInseted.id),
      );

      if (foulderData?.status === false) {
        throw new Error(foulderData.message);
      }

      const usersEntity: ChatUsers[] = [];

      chatData.users.forEach((userId) => {
        usersEntity.push(this.createEntity(userId, chatInseted));
      });

      await queryRunner.manager.save(ChatUsers, usersEntity);

      await queryRunner.commitTransaction();
      return chatInseted;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(e.sqlMessage ?? e);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }

  createEntity(userId: number, chat: Chat) {
    const userChat = this.chatUserRepository.create();
    userChat.chat = chat;
    userChat.userId = userId;
    return userChat;
  }

  async remove(id: string) {
    const res = await this.chatRepository
      .createQueryBuilder()
      .delete()
      .where(`id = :id`, { id })
      .execute();

    return !!res.affected;
  }

  async getGroupUsers(chatId: string) {
    const res: { userId: number }[] = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.userId', 'userId')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .where('chat.id = :chatId', { chatId })
      .getRawMany();

    const usersIdList = res.map((item) => item.userId);
    return usersIdList;
  }

  async getUsersListData(userList: number[]) {
    const usersData = await Promise.all(
      userList.map(async (userId) => {
        const res = await this.userService.getUserById(userId);
        return res;
      }),
    );
    return usersData;
  }

  async invaiteUsersToChat(invateData: IUserChat) {
    const chat = await this.getChatById(invateData.chatId);

    if ('status' in chat) {
      return chat;
    }

    const resStatus = await this.chatUserRepository
      .createQueryBuilder('chatUsers')
      .where('chatUsers.userId = :userId', { userId: invateData.userId })
      .andWhere('chatUsers.chatId = :chatId', { chatId: chat.id })
      .getOne();

    if (resStatus) {
      return false;
    }

    if (chat instanceof Chat) {
      const inseredUser = this.createEntity(invateData.userId, chat);

      await this.chatUserRepository.save(inseredUser);
    }
    return true;
  }

  async exitUserGroup(exitUserDTO: IUserChat) {
    const res = await this.chatUserRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: exitUserDTO.userId })
      .andWhere('chatId = :chatId', { chatId: exitUserDTO.chatId })
      .execute();

    return !!res.affected;
  }

  async getChatsByPattern(userId: number, pattern: string) {
    const listData: { chatId: string }[] = await this.chatUserRepository
      .createQueryBuilder('chatUsers')
      .select('chatUsers.chatId')
      .addSelect(
        (qb) =>
          qb
            .select('max(m.created_at)')
            .from(Message, 'm')
            .where('m.chatId = chatUsers.chatId'),
        'ord',
      )
      .innerJoin('chatUsers.chat', 'chat')
      .where('chatUsers.userId = :userId', { userId })
      .andWhere('chat.title like :title', { title: `%${pattern}%` })
      .orderBy('ord', 'DESC')
      .getRawMany();

    const idList = listData.map((item) => item.chatId);

    const chatsData = await this.socketService.getUserRoomsData(userId, idList);
    return chatsData;
  }

  async getContactList(listData: IGetContactList) {
    const contactList = await this.userService.getContactList(listData);

    if (Object.keys(contactList.resList).length === 0) return contactList;

    const contactListId = Object.keys(contactList.resList).map((contactId) =>
      parseInt(contactId),
    );

    const privateData = await this.getUsersPrivateChats(
      listData.userId,
      contactListId,
    );

    const keys = Object.keys(contactList.resList);

    privateData.forEach((item) => {
      if (!keys.includes(item.userId.toString())) return;

      contactList.resList[item.userId].chat = item.chat.id;
    });

    return contactList;
  }

  async getUsersPrivateChats(userId: number, userIdList: number[]) {
    const privateChats = await this.chatUserRepository
      .createQueryBuilder('chatUsers')
      .select(['chatUsers.userId', 'chat.id'])
      .innerJoin('chatUsers.chat', 'chat')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chatSQ.chatId')
          .where('chatSQ.userId = :userId', { userId })
          .from(ChatUsers, 'chatSQ')
          .getQuery();
        return 'chatUsers.chatId IN ' + subQuery;
      })
      .andWhere('userId IN (:userList)', { userList: userIdList })
      .andWhere('chat.adminId IS NULL')
      .getMany();

    return privateChats;
  }

  async checkPrivateChat(userId: number, contactId: number) {
    const chatId = await this.socketRedisAdapter.getValue(
      'privateChat',
      {
        getValuesFromDB: async () =>
          await this.getPrivateChatId(userId, contactId),
        isExpire: true,
      },
      userId,
      contactId,
    );
    return chatId;
  }

  async getPrivateChatId(userId: number, contactId: number) {
    const privateChat = await this.chatUserRepository
      .createQueryBuilder('chatUsers')
      .select('chat.id')
      .innerJoin('chatUsers.chat', 'chat')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chatSQ.chatId')
          .where('chatSQ.userId = :userId', { userId })
          .from(ChatUsers, 'chatSQ')
          .getQuery();
        return 'chatUsers.chatId IN ' + subQuery;
      })
      .andWhere('userId = :contactId', { contactId })
      .andWhere('chat.adminId IS NULL')
      .getRawOne();

    return privateChat?.['chat_id'];
  }
}
