import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { Media } from '@/message/entities/media.entity';
import { Chat } from '@/chat/entities/chat.entity';
import { ChatService } from '@/chat/chat.service';
import { Message } from '@/message/entities/message.entity';
import { IMessage } from '@/message/interfaces/IMessage';
import IEditMessage from '@/socket/interfaces/message/IEditMessage';
import IFile from '@/socket/interfaces/message/IFile';
import { IDeletedData } from '@/socket/interfaces/message/IDeleteMessage';
import { SocketRedisAdapter } from '@/socket/socketRedisAdapter.service';
import IChatMessages from '@/socket/interfaces/chat/IChatMessages';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private socketRedisAdapter: SocketRedisAdapter,
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

  async getRoomMessages(scrollData: IChatMessages) {
    let roomMessages: Message[] = [];
    const page = parseInt(scrollData.page);

    if (scrollData.inMemory) {
      const takeLength = page * scrollData.limit;

      roomMessages = await this.socketRedisAdapter.getHashes(
        'message',
        null,
        scrollData.chatId,
        takeLength,
        takeLength + scrollData.limit,
      );

      if (roomMessages?.length >= scrollData.limit)
        return {
          messages: roomMessages,
          page: page + 1,
          limit: scrollData.limit,
          inMemory: true,
          hasMore: true,
        };
      scrollData.page = '0';
    }

    const roomDbMessages = await this.getMessagesDB(
      scrollData.chatId,
      page,
      scrollData.limit,
    );

    if (roomMessages?.length <= scrollData.limit) {
      roomDbMessages.unshift(...roomMessages);
    }

    return {
      messages: roomDbMessages,
      page: page + 1,
      limit: scrollData.limit,
      inMemory: false,
      hasMore: roomDbMessages.length >= scrollData.limit,
    };
  }

  async getMessagesDB(chatId: string, page: number, limit: number) {
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
        message: ['error.notFoundMessage', messageId],
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateMessageData: IEditMessage) {
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
      await this.mediaRepository
        .createQueryBuilder()
        .delete()
        .where('messageId = :messageId', {
          messageId: updateMessageData.messageId,
        })
        .andWhere('fileId IN (:fileList)', {
          fileList: updateMessageData.deletedFiles,
        })
        .execute();

      await this.fileServiceClient.send(
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

  async removeMany(deletedData: IDeletedData[]) {
    const messagesIdList = deletedData.map((item) => item.id);

    const res = await this.messageRepository
      .createQueryBuilder()
      .delete()
      .where(`id in (:messagesIdList)`, { messagesIdList })
      .execute();

    return !!res.affected;
  }

  async setFilesDataToMessage(media: Media[]) {
    return await Promise.all(
      media.map(async (file) => {
        const res = await firstValueFrom(
          this.fileServiceClient.send('file/get', file.fileId),
        );
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
