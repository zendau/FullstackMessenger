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
  }

  async getAllByChat(chatId: string) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.chat', 'chat')
      .where('chat.chatId = :chatId', { chatId })
      .getMany();
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
