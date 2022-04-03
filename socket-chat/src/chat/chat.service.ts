import { Chat } from './entities/chat.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';

import * as uuid from 'uuid';
import { ChatUsers } from './entities/chatUsers.entity';
import { exitChatDto } from './dto/exitChat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
    private connection: Connection,
  ) {}

  async getContacts() {
    const res = await this.connection.query('SELECT * FROM `Users`');
    return res;
  }

  async getChats(userId: number) {
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.chatUsers', 'chatUsers')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(Chat, 'chat')
          .innerJoinAndSelect('chat.chatUsers', 'chatUsers')
          .select('chat.id')
          .where('chatUsers.userId = :userId', { userId })
          .getQuery();
        return 'chat.id IN' + subQuery;
      })
      .getMany();
    const chatData = this.createNameToChat(res, userId);
    return chatData;
  }

  createNameToChat(data: Chat[], userId: number) {
    return Promise.all(
      data.map(async (item) => {
        if (item.groupName.length === 0) {
          const chatUserId = item.chatUsers.filter(
            (user) => user.userId != userId,
          );
          const userData = await this.getUserName(chatUserId[0].userId);
          item.groupName = userData[0].login;
        }
        return item;
      }),
    );
  }

  async getUserName(id: number) {
    const res = await this.connection.query(
      `SELECT id, login FROM Users WHERE id = ${id}`,
    );
    return res;
  }

  async checkChat(chatData: ChatDTO) {
    console.log(chatData);
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.chatId, chat.chatId')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .addSelect('COUNT(chatUsers.userId)', 'userCount')
      .where('chatUsers.userId = :userId', { userId: chatData.adminId })
      .orWhere('chatUsers.userId = :companionId', {
        companionId: chatData.users[0],
      })
      .groupBy('chatUsers.chatId')
      .having('userCount > 1')
      .getRawMany();
    console.log('res', res);
    // const res = await this.chatUserRepository
    //   .createQueryBuilder('chatUsers')
    //   .innerJoinAndSelect('chatUsers.chat', 'chat')
    //   .getMany();
    // if (res === undefined)
    //   return {
    //     status: false,
    //     message: `userUd ${roomId} is not valid`,
    //     httpCode: HttpStatus.BAD_REQUEST,
    //   };

    return { status: res.length > 0, chatId: res[0]?.chatId };
  }

  async getChatById(id: string) {
    const res = await this.chatRepository
      .createQueryBuilder()
      .where('chatId = :id', { id })
      .getOne();
    if (res === undefined)
      return {
        status: false,
        message: `chatId ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return {
      res,
      status: true,
    };
  }

  async createChat(chatData: ChatDTO) {
    const chatInseted = await this.chatRepository.save({
      chatId: uuid.v4(),
      groupType: chatData.groupType,
      groupName: chatData?.groupName,
    });

    const usersEntity = [];

    usersEntity.push(this.createEntity(chatData.adminId, chatInseted));

    chatData.users.forEach((userId) => {
      usersEntity.push(this.createEntity(userId, chatInseted));
    });

    await this.chatUserRepository.save(usersEntity);

    return chatInseted;
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

  async remove(id: number) {
    const res = await this.chatRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${id}`)
      .execute();

    return !!res.affected;
  }

  async getGroupUsers(chatId: string) {
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.userId', 'userId')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .where('chat.chatId = :chatId', { chatId })
      .getRawMany();

    const usersData = await Promise.all(
      res.map(async (userData) => await this.getUserName(userData.userId)),
    );
    return usersData.flat();
  }

  async getInvaitedUsers(usersId: string[]) {
    const allUsers = await this.getContacts();

    const ids = usersId.map((id) => parseInt(id));

    const invaitedUsers = allUsers.filter(
      (userData) => ids.indexOf(userData.id) === -1,
    );

    return invaitedUsers;
  }

  async invaiteUsersToChat(invateData: UpdateChatDto) {
    const chat = await this.getChatById(invateData.roomId);

    if (chat.status) {
      const usersEntity = [];

      invateData.usersId.forEach((userId) => {
        usersEntity.push(this.createEntity(userId, chat.res));
      });

      return await this.chatUserRepository.save(usersEntity);
    } else {
      return chat;
    }
  }

  async exitUserGroup(exitUserDTO: exitChatDto) {
    const res = await this.chatUserRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: exitUserDTO.userId })
      .andWhere('chatId = :chatId', { chatId: exitUserDTO.chatId })
      .execute();

    return !!res.affected;
  }
}
