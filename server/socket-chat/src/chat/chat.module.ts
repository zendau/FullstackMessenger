import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '@/chat/chat.service';
import { ChatController } from '@/chat/chat.controller';
import { Chat } from '@/chat/entities/chat.entity';
import { ChatUsers } from '@/chat/entities/chatUsers.entity';
import { UserService } from '@/chat/user.service';
import { SocketModule } from '@/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatUsers]),
    forwardRef(() => SocketModule),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get(
                'RABBITMQ_LOGIN',
              )}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get(
                'RABBITMQ_HOST',
              )}:${configService.get('RABBITMQ_PORT')}`,
            ],
            queue: 'auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'PEER_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get(
                'RABBITMQ_LOGIN',
              )}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get(
                'RABBITMQ_HOST',
              )}:${configService.get('RABBITMQ_PORT')}`,
            ],
            queue: 'peer_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, UserService],
  exports: [ChatService, UserService],
})
export class ChatModule {}
