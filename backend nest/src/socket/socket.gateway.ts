import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('user connected');
  }

  handleDisconnect() {
    console.log('user disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    this.socketService.addUser(payload);
    //this.server.sockets.emit('answer', 'hello');
  }

  @SubscribeMessage('room')
  roomEvent(client: any, payload: any) {
    console.log(payload);
    const room = this.socketService.getRoomUser(payload);
    this.server.sockets.emit('answer', room);
  }
}
