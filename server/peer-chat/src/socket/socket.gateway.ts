import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import INewRoomData from './interfaces/INewRoomData';
import IUserConnect from './interfaces/IUserConnect';
import IUserInvite from './interfaces/IUserInvite';
import IUserJoin from './interfaces/IUserJoin';
import IUserMediaStatus from './interfaces/IUserMediaStatus';
import { SocketService } from './socket.service';

@WebSocketGateway(81, {
  path: '/peerChat',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(socket: Socket) {
    const userData = this.socketService.getUserById(socket.id);

    if (userData !== undefined) {
      this.socketService.clientDisconnect(socket.id);
      const roomUser = this.socketService.getRoomUsers(userData.roomId);
      this.server.to(userData.roomId).emit('getUsers', roomUser);
      this.server.to(userData.roomId).emit('UserLeave', userData.peerId);
      this.server.emit('getFreeUsers', this.socketService.getFreeUsers());
    }
  }

  @SubscribeMessage('connect-user')
  connectEvent(@MessageBody() payload: IUserConnect) {
    console.log('payload', payload);
    this.socketService.addUser(payload);
    this.server.emit('getFreeUsers', this.socketService.getFreeUsers());
  }

  @SubscribeMessage('invite-user')
  inviteUserToRoom(@MessageBody() payload: IUserInvite) {
    this.server.emit('userInviteRoom', payload);
  }

  @SubscribeMessage('insertNewRoom')
  insertNewRoom(socket: Socket, payload: INewRoomData) {
    socket.broadcast.emit('updateListOfRooms', payload);
  }

  @SubscribeMessage('deleteRoom')
  deleteConferenceRoom(@MessageBody() roomId: string) {
    this.server.to(roomId).emit('redirectUsers');
  }

  @SubscribeMessage('join-room')
  handleMessage(socket: Socket, payload: IUserJoin) {
    this.socketService.clientJoinRoom(
      payload.userId,
      payload.roomId,
      payload.peerId,
    );

    socket.join(payload.roomId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    socket.broadcast.to(payload.roomId).emit('userJoinedRoom', payload.peerId);
    this.server.emit('getFreeUsers', this.socketService.getFreeUsers());
  }

  @SubscribeMessage('exit-room')
  roomEvent(socket: Socket, payload: IUserMediaStatus) {
    this.socketService.clientLeaveRoom(payload.userId);
    socket.leave(payload.roomId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    this.server.emit('getFreeUsers', this.socketService.getFreeUsers());
  }

  @SubscribeMessage('userMute')
  userMute(@MessageBody() payload: IUserMediaStatus) {
    this.socketService.changeMuteStatus(payload.userId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }

  @SubscribeMessage('videoPause')
  videoPause(@MessageBody() payload: IUserMediaStatus) {
    this.socketService.changeVideoPause(payload.userId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }
}
