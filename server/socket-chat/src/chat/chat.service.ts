import { Chat } from './entities/chat.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatUsers } from './entities/chatUsers.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from 'src/message/entities/message.entity';
import { SocketRedisAdapter } from 'src/socket/socketRedisAdapter.service';
import IUser from './interfaces/IUser';
import IGetDataError from './interfaces/IGetDataError';
import IChat from './interfaces/IChat';
import { UserService } from './user.service';
import IChatPagination from 'src/socket/interfaces/chat/IChatPagination';
import IUserChat from 'src/socket/interfaces/user/IUserChat';
import IChatCreate from './interfaces/IChatCreate';
import IGetContactList from './interfaces/IGetContactList';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
    private userService: UserService,
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

  async getChatPagination({ page, limit, userId }: IChatPagination) {
    const start = page * limit;
    const listPaginationData = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chat.id')
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
      .offset(start)
      .limit(limit)
      .getMany();

    const idList = listPaginationData.map((item) => item.id);

    return {
      idList,
      hasMore: idList.length !== limit,
    };
  }

  // async getChats(chatList: string[]) {
  //   // const res = await this.chatRepository
  //   //   .createQueryBuilder('chat')
  //   //   .innerJoinAndSelect('chat.chatUsers', 'chatUsers')
  //   //   .where((qb) => {
  //   //     const subQuery = qb
  //   //       .subQuery()
  //   //       .from(Chat, 'chat')
  //   //       .innerJoinAndSelect('chat.chatUsers', 'chatUsers')
  //   //       .select('chat.id')
  //   //       .where('chatUsers.userId = :userId', { userId })
  //   //       .getQuery();
  //   //     return 'chat.id IN' + subQuery;
  //   //   })
  //   //   .getMany();

  //   const resList = await this.chatRepository
  //     .createQueryBuilder('')
  //     .where('id IN (:chatList) ', { chatList })
  //     .getMany();

  //   return resList;

  //   // const chatData = await this.createNameToChat(res, userId);
  //   // return chatData;
  // }

  // async createNameToChat(data: Chat[], userId: number) {
  //   return await Promise.all(
  //     data.map(async (item) => {
  //       if (item.title === null) {
  //         const chatUserId = item.chatUsers.filter(
  //           (user) => user.userId != userId,
  //         );
  //         const userData = await this.userService.getUserById(
  //           chatUserId[0].userId,
  //         );

  //         item.title = userData.login;
  //       }
  //       return item;
  //     }),
  //   );
  // }

  // async getUserByid(id: number | string) {
  //   if (!id) return null;

  //   const res = await firstValueFrom(
  //     this.authServiceClient.send('user/id', id),
  //   );
  //   return res;
  // }

  // async checkChat(chatData: IChatCreate) {
  //   const res: { chatId: string; id: string; adminId: number }[] =
  //     await this.chatRepository
  //       .createQueryBuilder('chat')
  //       .select('chatUsers.chatId, chat.id, chat.adminId')
  //       .addSelect('chat.groupName')
  //       .innerJoin('chat.chatUsers', 'chatUsers')
  //       .addSelect('COUNT(chatUsers.userId)', 'userCount')
  //       .where('chatUsers.userId = :userId', { userId: chatData.adminId })
  //       .orWhere('chatUsers.userId = (:companionId)', {
  //         companionId: chatData.users,
  //       })
  //       .groupBy('chatUsers.chatId')
  //       .having('userCount > 1')
  //       .andHaving('chat.groupName IS NULL')
  //       .getRawMany();
  //   return { status: res.length > 0, chatId: res[0]?.id };
  // }

  async getChatById(id: string) {
    const res = (await this.chatRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne()) as unknown as IChat;
    if (res === undefined)
      return {
        status: false,
        message: `chat id - ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    try {
      const resGetGroupUsers = await this.getGroupUsers(res.id);
      res.users = resGetGroupUsers;
      return res;
    } catch (e) {
      return {
        status: false,
        message: e.message as string,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createChat(chatData: IChatCreate) {
    try {
      const chatInseted = await this.chatRepository.save({
        ...(chatData?.groupName && { adminId: chatData.adminId }),
        groupName: chatData?.groupName,
      });

      const usersEntity: ChatUsers[] = [];

      usersEntity.push(this.createEntity(chatData.adminId, chatInseted));

      chatData.users.forEach((userId) => {
        usersEntity.push(this.createEntity(userId, chatInseted));
      });

      await this.chatUserRepository.save(usersEntity);

      return chatInseted;
    } catch (e) {
      return {
        status: false,
        message: e.sqlMessage ?? e,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  createEntity(userId: number, chat: Chat) {
    const userChat = this.chatUserRepository.create();
    userChat.chat = chat;
    userChat.userId = userId;
    return userChat;
  }

  // async update(updateRoomDTO: IEditRoomDTO) {
  //   const res = await this.roomRepository
  //     .createQueryBuilder()
  //     .update()
  //     .set({
  //       adminLogin: updateRoomDTO.adminLogin,
  //       roomId: uuidv4(),
  //       roomTitle: updateRoomDTO.roomTitle,
  //     })
  //     .where(`id = ${updateRoomDTO.id}`)
  //     .execute();

  //   return !!res.affected;
  // }

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
    const usersData = await this.getUsersListData(usersIdList);
    return usersData;
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
    return idList;
  }

  async getContactList(listData: IGetContactList) {
    debugger;
    const contactList = await this.userService.getContactList(listData);

    const contactListId = Object.keys(contactList.resList).map((contactId) =>
      parseInt(contactId),
    );

    const privateData = await this.getUsersPrivateChats(
      listData.userId,
      contactListId,
    );

    const keys = Object.keys(contactList.resList);

    privateData.forEach((item) => {
      debugger;

      if (!keys.includes(item.userId.toString())) return;

      contactList.resList[item.userId].chat = item.chat.id;
    });

    console.log('privateData', privateData);

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
      .getMany();

    return privateChats;
  }
}
