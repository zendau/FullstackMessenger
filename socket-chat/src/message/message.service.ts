import { Chat } from './../chat/entities/chat.entity';
import { ChatService } from './../chat/chat.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private chatService: ChatService,
  ) {}

  async create(createMessageDTO: IMessageDTO) {
    // TODO : Проверка пользователя на принадлежность к чату

    const userData = await this.chatService.getUserName(
      createMessageDTO.authorId,
    );

    if (userData.length > 0) {
      console.log('userData', userData);

      const chatData = await this.chatService.getChatById(
        createMessageDTO.chatId,
      );

      if (chatData.res instanceof Chat) {
        const chat = chatData.res;

        const resInsered = await this.messageRepository.save({
          ...createMessageDTO,
          chat,
        });
        return resInsered;
      } else {
        return chatData;
      }
    } else {
      return {
        status: false,
        message: `userId ${createMessageDTO.authorId} is not found`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getAllByChat(chatId: number) {
    // TODO: Пагинация

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId })
      // .skip()
      // .take()
      .getMany();

    const messagesWithLogin = await Promise.all(
      messages.map(async (message: any) => {
        const userData = await this.chatService.getUserName(message.authorId);
        console.log('userData', userData);
        message.login = userData[0].login;
        console.log('message', message);
        return message;
      }),
    );

    return messagesWithLogin;
  }

  async getById(messageId: number) {
    const res = await this.messageRepository
      .createQueryBuilder()
      .where('id = :messageId', { messageId })
      .getOne();

    if (res === undefined)
      return {
        status: false,
        message: `messageId ${messageId} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateMessageDTO: IUpdateMessageDTO) {
    const res = await this.messageRepository
      .createQueryBuilder()
      .update()
      .set({
        content: updateMessageDTO.content,
      })
      .where(`id = ${updateMessageDTO.id}`)
      .execute();

    return !!res.affected;
  }

  async remove(id: number) {
    const res = await this.messageRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${id}`)
      .execute();

    return !!res.affected;
  }
}
