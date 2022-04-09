import { Media } from './entities/media.entity';
import { Chat } from './../chat/entities/chat.entity';
import { ChatService } from './../chat/chat.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import axios from 'axios';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private chatService: ChatService,
  ) {}
  async create(createMessageDTO: IMessageDTO, files?: number[]) {
    // TODO : Проверка пользователя на принадлежность к чату
    const chatData = await this.chatService.getChatById(
      createMessageDTO.chatId,
    );
    if (chatData instanceof Chat) {
      // TODO : подумать про то, стоит ли тут быть типу any
      const messageInsered: any = await this.messageRepository.save({
        chat: chatData,
        authorLogin: createMessageDTO.authorLogin,
        text: createMessageDTO.text,
      });
      if (files !== null) {
        const filesInsered = await Promise.all(
          files.map(async (fileId) => {
            const resInsered = await this.mediaRepository.save({
              fileId,
              message: messageInsered,
            });
            return resInsered.fileId;
          }),
        );
        messageInsered.media = filesInsered;
      }
      return messageInsered;
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
      .leftJoinAndSelect('message.media', 'media')
      .where('chat.id = :chatId', { chatId })
      .skip(skip)
      .take(limit)
      .orderBy('message.id', 'DESC')
      .getMany();

    // TODO : Удалить запрос на получение данныъ о файле и добавить в микросервисе запрос на получение данных о файлах из другого микросервиса
    // TEMP AREA
    const resMessages = await Promise.all(
      messages.map(async (message: any) => {
        if (message.media.length > 0) {
          message.files = await Promise.all(
            message.media.map(async (file) => {
              const res = await axios.get(
                `http://localhost:5000/file/get/${file.fileId}`,
              );
              return res.data;
            }),
          );
          console.log('MESSAGE', message.files);
        }
        return message;
      }),
    );
    // TEMP AREA

    return resMessages;
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
