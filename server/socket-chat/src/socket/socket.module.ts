import { MessageModule } from './../message/message.module';
import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [MessageModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
