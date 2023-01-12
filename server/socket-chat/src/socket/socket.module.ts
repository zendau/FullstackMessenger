import { MessageModule } from './../message/message.module';
import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ChatModule } from 'src/chat/chat.module';
import { TasksService } from './task.service';
import { SocketRedisAdapter } from './socketRedisAdapter.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [
    MessageModule,
    forwardRef(() => ChatModule),
    ClientsModule.registerAsync([
      {
        name: 'FILE_SERVICE',
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
            queue: 'file_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [SocketGateway, SocketService, SocketRedisAdapter],
  exports: [SocketRedisAdapter, SocketService],
})
export class SocketModule {}
