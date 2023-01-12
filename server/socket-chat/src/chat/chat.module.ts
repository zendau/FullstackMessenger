import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatUsers } from './entities/chatUsers.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SocketRedisAdapter } from 'src/socket/socketRedisAdapter.service';
import { UserService } from './user.service';
import { SocketService } from 'src/socket/socket.service';
import { SocketModule } from 'src/socket/socket.module';

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
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, UserService],
  exports: [ChatService, UserService],
})
export class ChatModule {}
