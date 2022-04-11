import { MessageController } from './ChatService/message/message.controller';
import { ChatController } from './ChatService/chat/chat.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PEER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:root@localhost:5672'],
          queue: 'peer_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:root@localhost:5672'],
          queue: 'chat_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'FILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:root@localhost:5672'],
          queue: 'file_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, ChatController, MessageController],
  providers: [AppService],
})
export class AppModule {}
