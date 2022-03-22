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

  handleDisconnect(socket: Socket) {
    console.log('user disconnected');

    const userData = this.socketService.getUserById(socket.id);
    console.log('userData', userData, socket.id);

    if (userData !== undefined) {
      this.socketService.userLeaveChat(socket.id);
      const roomUser = this.socketService.getRoomUser(userData.roomId);
      this.server.to(userData.roomId).emit('getUsers', roomUser);
    }
  }

  @SubscribeMessage('join-room')
  handleMessage(socket: Socket, payload: any) {
    console.log('user-connected', payload);
    socket.join(payload.roomId);
    this.socketService.addUser(payload);
    const roomUser = this.socketService.getRoomUser(payload.roomId);
    console.log('join', roomUser, payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }

  @SubscribeMessage('exit-room')
  roomEvent(socket: Socket, payload: any) {
    console.log('exit-room', payload);
    this.socketService.userLeaveChat(payload.userId);
    socket.leave(payload.roomId);
    const roomUser = this.socketService.getRoomUser(payload.roomId);
    console.log('exit', roomUser);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }
}
