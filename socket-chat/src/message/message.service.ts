import { Media } from './entities/media.entity';
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
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private chatService: ChatService,
  ) {}
  async create(createMessageDTO: IMessageDTO) {
    // TODO : Проверка пользователя на принадлежность к чату

    const chatData = await this.chatService.getChatById(
      createMessageDTO.chatId,
    );
    if (chatData instanceof Chat) {
      const resInsered = await this.messageRepository.save({
        chat: chatData,
        authorLogin: createMessageDTO.authorLogin,
        text: createMessageDTO.text,
      });
      const res = await this.mediaRepository.create({
        fileId: 1,
        isMedia: true,
      });
      return resInsered;
    } else {
      return chatData;
    }
  }

  async getAllByChat(chatId: number, page: number, limit: number) {
    // TODO: Пагинация
    const skip = page * limit;

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId })
      .skip(skip)
      .take(limit)
      .orderBy('message.id', 'DESC')
      .getMany();

    return messages;
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
        text: updateMessageDTO.text,
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
