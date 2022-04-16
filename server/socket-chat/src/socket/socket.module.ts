import { MessageModule } from './../message/message.module';
import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MessageModule,
    ClientsModule.register([
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
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
