import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MessageModule } from '@/message/message.module';
import { SocketService } from '@/socket/socket.service';
import { SocketGateway } from '@/socket/socket.gateway';
import { ChatModule } from '@/chat/chat.module';
import { SocketRedisAdapter } from '@/socket/socketRedisAdapter.service';

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
  providers: [SocketGateway, SocketService, SocketRedisAdapter],
  exports: [SocketRedisAdapter, SocketService],
})
export class SocketModule {}
