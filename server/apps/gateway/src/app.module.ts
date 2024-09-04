import { UserController } from './services/auth/UserModule/user.controller';
import { RoomController } from './services/peer/room/room.controller';
import { FoulderController } from './services/fileCloud/foulder/foulder.controller';
import { MessageController } from './services/chat/message/message.controller';
import { ChatController } from './services/chat/chat/chat.controller';
import { CacheModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileController } from './services/fileCloud/file/file.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { RefreshStrategy } from './common/strategies/refresh.strategy';

import * as redisStore from 'cache-manager-redis-store';
import { ContactController } from './services/auth/UserModule/contact.controller';
import { AdminController } from './services/auth/UserModule/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 480,
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
    ContactController,
    AdminController,
  ],
  providers: [JwtStrategy, RefreshStrategy],
})
export class AppModule {}
