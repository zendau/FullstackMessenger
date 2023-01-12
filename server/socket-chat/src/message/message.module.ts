import { ChatModule } from './../chat/chat.module';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SocketRedisAdapter } from 'src/socket/socketRedisAdapter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Media]),
    ChatModule,
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
  controllers: [MessageController],
  providers: [MessageService, SocketRedisAdapter],
  exports: [MessageService],
})
export class MessageModule {}
