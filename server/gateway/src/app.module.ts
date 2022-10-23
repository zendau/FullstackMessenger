import { UserController } from './AuthService/UserModule/user.controller';
import { RoomController } from './PeerService/room/room.controller';
import { FoulderController } from './FileCloudService/foulder/foulder.controller';
import { MessageController } from './ChatService/message/message.controller';
import { ChatController } from './ChatService/chat/chat.controller';
import { CacheModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileController } from './FileCloudService/file/file.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './AuthService/strategies/jwt.strategy';
import { RefreshStrategy } from './AuthService/strategies/refresh.strategy';
import { ClientOpts } from '@nestjs/microservices/external/redis.interface';

import * as redisStore from 'cache-manager-redis-store';
import { ContactController } from './AuthService/UserModule/contact.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env']
    }),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 480
    }),
    ClientsModule.register([
      {
        name: 'PEER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
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
          urls: [
            `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
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
          urls: [
            `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: 'file_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    ChatController,
    MessageController,
    FoulderController,
    FileController,
    RoomController,
    UserController,
    ContactController
  ],
  providers: [JwtStrategy, RefreshStrategy],
})
export class AppModule {}
