import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Media } from '@/message/entities/media.entity';
import { Message } from '@/message/entities/message.entity';
import { MessageService } from '@/message/message.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private messageService: MessageService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('30 * * * * *')
  async messagesCron() {
    const messagesData: [Error, Message][] = [];
    let scanPos = 0;
    while (true) {
      const scanRes = await this.redis.scan(scanPos, 'match', 'message:*');
      scanPos = parseInt(scanRes[0]);

      if (scanPos === 0 && scanRes[1].length === 0) break;

      const multiPipe = this.redis.multi();

      scanRes[1].forEach((key) => {
        multiPipe.hgetall(key);
      });

      const messagesRes = await multiPipe.exec();

      messagesData.push(...messagesRes);

      scanRes[1].forEach((key) => {
        this.redis.del(key);
        this.redis.del(`map-${key}`);
      });
    }

    const inseredData = [];

    for (const roomMessages of messagesData) {
      console.log('roomMessages', roomMessages);
      if (roomMessages[0]) return;

      const messages = roomMessages[1];

      Object.keys(messages).forEach((messageValue) => {
        const message = JSON.parse(messages[messageValue]);
        const messageEntiry = new Message();

        const filesData = [];

        message.files?.forEach((file) => {
          const media = new Media();
          media.fileId = file.id;
          filesData.push(media);
        });

        messageEntiry.id = message.id;
        messageEntiry.authorId = message.authorId;
        messageEntiry.authorLogin = message.authorLogin;
        messageEntiry.chat = message.roomId;
        messageEntiry.created_at = message.created_at;
        messageEntiry.isEdited = message.isEdited;
        messageEntiry.files = filesData;
        messageEntiry.text = message.text;
        messageEntiry.type = message.type;

        inseredData.push(messageEntiry);
      });
    }
    console.log('messagesData', messagesData);
    console.log('inseredData ', inseredData);
    this.messageService.setMany(inseredData);

    scanPos = 0;
    while (true) {
      const scanRes = await this.redis.scan(scanPos, 'match', 'hotChats:*');
      scanPos = parseInt(scanRes[0]);

      if (scanPos === 0 && scanRes[1].length === 0) break;

      const multiPipe = this.redis.multi();

      scanRes[1].forEach((key) => {
        multiPipe.del(key);
      });

      multiPipe.exec();
    }

    this.logger.debug('Called when the current second is 45');
  }

  @Cron('0 50 21 * * 0-6')
  clearDateChatCron() {
    this.logger.debug('CLEAR');
    this.redis.del('chatDate');
  }
}
