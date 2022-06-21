import { Chat } from './entities/chat.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';

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
    return res;
  }

  async checkChat(chatData: ChatDTO) {
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.chatId, chat.id, chat.adminId')
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
    debugger;
    console.log('res', res);
    return { status: res.length > 0, chatId: res[0]?.id };
  }

  async getChatById(id: string) {
    const res: any = await this.chatRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
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
        message: e.message,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createChat(chatData: ChatDTO) {
    const chatInseted = await this.chatRepository.save({
      ...(chatData?.groupName && { adminId: chatData.adminId }),
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

  async remove(id: string) {
    const res = await this.chatRepository
      .createQueryBuilder()
      .delete()
      .where(`id = :id`, { id })
      .execute();

    return !!res.affected;
  }

  async getGroupUsers(chatId: string) {
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.userId', 'userId')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .where('chat.id = :chatId', { chatId })
      .getRawMany();

    const usersData = await Promise.all(
      res.map(async (userData) => {
        const res = await this.getUserName(userData.userId);
        if (res.status === false) throw new Error(res.message);
        return res;
      }),
    );
    return usersData;
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

    const temp = await this.chatUserRepository
      .createQueryBuilder('chatUsers')
      .where('chatUsers.userId = :userId', { userId: invateData.userId })
      .andWhere('chatUsers.chatId = :chatId', { chatId: chat.id })
      .getOne();

    if (temp) {
      return {
        status: 'true',
        message: 'already added',
      };
    }

    if (chat instanceof Chat) {
      const inseredUser = this.createEntity(invateData.userId, chat);

      return await this.chatUserRepository.save(inseredUser);
    } else {
      return chat;
    }
  }

  async exitUserGroup(exitUserDTO: exitChatDto) {
    console.log(exitUserDTO);
    const res = await this.chatUserRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: exitUserDTO.userId })
      .andWhere('chatId = :chatId', { chatId: exitUserDTO.chatId })
      .execute();

    return !!res.affected;
  }
}
