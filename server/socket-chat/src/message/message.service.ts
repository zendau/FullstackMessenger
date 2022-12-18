import { Media } from './entities/media.entity';
import { Chat } from './../chat/entities/chat.entity';
import { ChatService } from './../chat/chat.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IMessage } from './interfaces/IMessage';
import IEditMessage from 'src/socket/interfaces/message/IEditMessage';
import IFile from 'src/socket/interfaces/message/IFile';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private chatService: ChatService,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}
  async create(createMessageDTO: IMessage, files?: IFile[]) {
    const chatData = await this.chatService.getChatById(
      createMessageDTO.chatId,
    );
    if (chatData instanceof Chat) {
      const messageInsered: Message = await this.messageRepository.save({
        chat: chatData,
        authorLogin: createMessageDTO.authorLogin,
        text: createMessageDTO.text,
      });
      if (files !== null) {
        messageInsered.files = await this.saveFilesMediaData(
          files,
          messageInsered.id,
        );
      }
      return messageInsered;
    } else {
      return chatData;
    }
  }

  async saveFilesMediaData(files: IFile[], messageInsered: string) {
    const filesInsered = await Promise.all(
      files.map(async (file) => {
        const resInsered = await this.mediaRepository.save({
          fileId: file.id,
          message: messageInsered,
        });
        return resInsered;
      }),
    );
    return filesInsered;
  }

  async setMany(messagesData: IMessage[]) {
    const messages = await this.messageRepository.save(messagesData);
    console.log(messages);
  }

  async getAllByChat(chatId: string, page: number, limit: number) {
    const skip = page * limit;

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chat', 'chat')
      .leftJoinAndSelect('message.files', 'files')
      .where('chat.id = :chatId', { chatId })
      .skip(skip)
      .take(limit)
      .orderBy('message.id', 'DESC')
      .getMany();

    for (const message of messages) {
      message.files = await this.setFilesDataToMessage(message.files);
    }

    return messages;
  }

  async getLastChatMessage(chatId: string) {
    const resData = await this.messageRepository
      .createQueryBuilder()
      .where('chatId = :chatId', { chatId })
      .orderBy('id', 'DESC')
      .limit(1)
      .getOne();

    return resData;
  }

  async getById(messageId: string) {
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

  async update(updateMessageData: IEditMessage) {
    debugger;

    const res = await this.messageRepository
      .createQueryBuilder()
      .update()
      .set({
        text: updateMessageData.updatedText,
        isEdited: true,
      })
      .where('id = :messageId', { messageId: updateMessageData.messageId })
      .execute();

    if (updateMessageData.deletedFiles?.length > 0) {
      const files = await this.mediaRepository
        .createQueryBuilder()
        .delete()
        .where('messageId = :messageId', {
          messageId: updateMessageData.messageId,
        })
        .andWhere('fileId IN (:fileList)', {
          fileList: updateMessageData.deletedFiles,
        })
        .execute();

      const deleteStatus = await this.fileServiceClient.send(
        'file/deleteMany',
        updateMessageData.deletedFiles,
      );
    }

    if (updateMessageData.files) {
      this.saveFilesMediaData(
        updateMessageData.files,
        updateMessageData.messageId,
      );
    }
    // const filesInsered = await Promise.all(
    //   files.map(async (fileId) => {
    //     const resInsered = await this.mediaRepository.save({
    //       fileId,
    //       message: messageInsered,
    //     });
    //     return resInsered.fileId;
    //   }),
    // );

    return !!res.affected;
  }

  async remove(id: number) {
    const res = await this.messageRepository
      .createQueryBuilder()
      .delete()
      .where(`id = :id`, { id })
      .execute();

    return !!res.affected;
  }

  async removeMany(idList: (number | string)[]) {
    const res = await this.messageRepository
      .createQueryBuilder()
      .delete()
      .where(`id in (:idList)`, { idList })
      .execute();

    return !!res.affected;
  }

  async setFilesDataToMessage(media: Media[]) {
    return await Promise.all(
      media.map(async (file) => {
        console.log('file', file);
        const res = await firstValueFrom(
          this.fileServiceClient.send('file/get', file.fileId),
        );
        console.log('res', res);
        if (res.status === false) {
          throw new HttpException(res.message, res.httpCode);
        }
        return res;
      }),
    );
  }

  async getMaxSortedChatMessageQuery(chaid: string) {
    const messageQuery = this.messageRepository
      .createQueryBuilder()
      .select('max(created_at)')
      .where('chatId = :id', { id: chaid });
    return messageQuery;
  }
}
