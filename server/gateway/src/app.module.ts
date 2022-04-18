import { RoomController } from './PeerService/room/room.controller';
import { FoulderController } from './FileCloudService/foulder/foulder.controller';
import { MessageController } from './ChatService/message/message.controller';
import { ChatController } from './ChatService/chat/chat.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileController } from './FileCloudService/file/file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ]),
  ],
  controllers: [
    AppController,
    ChatController,
    MessageController,
    FoulderController,
    FileController,
    RoomController,
  ],
  providers: [AppService],
})
export class AppModule {}
