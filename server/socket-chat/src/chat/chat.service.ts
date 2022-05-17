import { Chat } from './entities/chat.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';

import * as uuid from 'uuid';
import { ChatUsers } from './entities/chatUsers.entity';
import { exitChatDto } from './dto/exitChat.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
    private connection: Connection,
    @Inject('AUTH_SERVICE') private authServiceClient: ClientProxy,
  ) {}

  async getContacts() {
    const res = await firstValueFrom(
      this.authServiceClient.send('user/all', ''),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  async getChats(userId: number) {
    debugger;
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
    const chatData = await this.createNameToChat(res, userId);
    return chatData;
  }

  async createNameToChat(data: Chat[], userId: number) {
    return await Promise.all(
      data.map(async (item) => {
        if (item.groupName === null) {
          const chatUserId = item.chatUsers.filter(
            (user) => user.userId != userId,
          );
          const userData = await this.getUserName(chatUserId[0].userId);
          console.log('1', userData);
          item.groupName = userData.login;
        }
        return item;
      }),
    );
  }

  async getUserName(id: number) {
    const res = await firstValueFrom(
      this.authServiceClient.send('user/id', id),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  async checkChat(chatData: ChatDTO) {
    console.log('chatData', chatData);
    debugger;
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.chatId, chat.chatId, chat.adminId')
      .addSelect('chat.groupName')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .addSelect('COUNT(chatUsers.userId)', 'userCount')
      .where('chatUsers.userId = :userId', { userId: chatData.adminId })
      .orWhere('chatUsers.userId = (:companionId)', {
        companionId: chatData.users,
      })
      .groupBy('chatUsers.chatId')
      .having('userCount > 1')
      .andHaving('chat.groupName IS NULL')
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
    const res: any = await this.chatRepository
      .createQueryBuilder()
      .where('chatId = :id', { id })
      .getOne();
    if (res === undefined)
      return {
        status: false,
        message: `chatId ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    res.users = await this.getGroupUsers(res.chatId);
    return res;
  }

  async createChat(chatData: ChatDTO) {
    const chatInseted = await this.chatRepository.save({
      chatId: uuid.v4(),
      adminId: chatData?.adminId,
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

    if (chat instanceof Chat) {
      const inseredUser = this.createEntity(invateData.userId, chat);

      return await this.chatUserRepository.save(inseredUser);
    } else {
      return chat;
    }
  }

  async exitUserGroup(exitUserDTO: exitChatDto) {
    const chat = await this.getChatById(exitUserDTO.chatId);

    const res = await this.chatUserRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: exitUserDTO.userId })
      .andWhere('chatId = :chatId', { chatId: chat.id })
      .execute();

    return !!res.affected;
  }
}
