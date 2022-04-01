import { Chat } from './entities/chat.entity';
import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';

import * as uuid from 'uuid';
import { ChatUsers } from './entities/chatUsers.entity';

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
    console.log('1');
    const res = await this.connection.query('SELECT * FROM `Users`');
    console.log('res', res);
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
    return res;
  }

  async checkChat(userId: number, companionId: number) {
    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chatUsers.chatId')
      .innerJoin('chat.chatUsers', 'chatUsers')
      .addSelect('COUNT(chatUsers.userId)', 'userCount')
      .where('chatUsers.userId = :userId', { userId })
      .orWhere('chatUsers.userId = :companionId', { companionId })
      .groupBy('chatUsers.chatId')
      .having('userCount > 1')
      .getRawMany();

    // const res = await this.chatUserRepository
    //   .createQueryBuilder('chatUsers')
    //   .innerJoinAndSelect('chatUsers.chat', 'chat')
    //   .getMany();

    console.log(userId, companionId, res);
    // if (res === undefined)
    //   return {
    //     status: false,
    //     message: `userUd ${roomId} is not valid`,
    //     httpCode: HttpStatus.BAD_REQUEST,
    //   };

    return res.length > 0;
  }

  async createChat(chatData: ChatDTO) {
    const resInsered = [];

    const chatInseted = await this.chatRepository.save({
      chatId: uuid.v4(),
      groupType: false,
    });

    resInsered.push(await this.addToChat(chatData.userId, chatInseted));
    resInsered.push(await this.addToChat(chatData.companionId, chatInseted));

    return resInsered;
  }

  async addToChat(userId: number, chat: Chat) {
    const userChat = this.chatUserRepository.create();
    userChat.chat = chat;
    userChat.userId = userId;

    const resInsered = await this.chatUserRepository.save(userChat);
    return resInsered;
  }
}
