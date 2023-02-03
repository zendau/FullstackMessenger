import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import INewRoomData from './interfaces/INewRoomData';
import IUserInvite from './interfaces/IUserInvite';
import IUserJoin from './interfaces/IUserJoin';
import IUserMediaStatus from './interfaces/IUserMediaStatus';
import { SocketService } from './socket.service';
import ICallingData from './interfaces/ICallingData';

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
    const roomId = socket.data.roomId;

    if (!roomId) return;

    const userId = socket.data.userId;

    const roomUsers = this.socketService.clientLeaveRoom(roomId, userId);

    // TODO: проверить можно ли оптимизировать до 1
    this.server.to(roomId).emit('getUsers', roomUsers);
    this.server.to(roomId).emit('UserLeave', roomUsers);
  }

  @SubscribeMessage('connect-user')
  async connectUser(socket: Socket, userId: number) {
    socket.data.userId = userId;
  }

  @SubscribeMessage('join-room')
  handleMessage(socket: Socket, payload: IUserJoin) {
    socket.data.roomId = payload.roomId;

    const roomUser = this.socketService.clientJoinRoom(
      payload.userId,
      payload.userLogin,
      payload.roomId,
      payload.peerId,
    );

    console.log('JOIN RIIM', roomUser, socket.data);

    socket.join(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
    socket.broadcast.to(payload.roomId).emit('userJoinedRoom', payload.peerId);
  }

  @SubscribeMessage('invite-user')
  inviteUserToRoom(@MessageBody() payload: IUserInvite) {
    this.server.emit('userInviteRoom', payload);
  }

  @SubscribeMessage('initInviteCalling')
  initInviteCalling(socket: Socket, payload: ICallingData) {
    payload.users.forEach((userPeerId) => {
      console.log('CALL TO', userPeerId);
      this.server.to(userPeerId).emit('receiveInviteCalling', payload);
    });
  }

  @SubscribeMessage('cancelCalling')
  cancelCalling(socket: Socket, payload: ICallingData) {
    payload.users.forEach((userPeerId) => {
      this.server.to(userPeerId).emit('cancelInviteCalling');
    });
  }

  @SubscribeMessage('acceptCalling')
  acceptCalling(socket: Socket, payload: ICallingData) {
    this.server.to(payload.from.peerId).emit('acceptInviteCalling', payload);
  }

  @SubscribeMessage('rejectCalling')
  rejectCalling(socket: Socket, payload: ICallingData) {
    this.server.to(payload.from.peerId).emit('rejectInviteCalling', socket.id);
  }

  @SubscribeMessage('deleteRoom')
  deleteConferenceRoom(@MessageBody() roomId: string) {
    this.server.to(roomId).emit('redirectUsers');
  }

  @SubscribeMessage('exit-room')
  roomEvent(socket: Socket, payload: IUserMediaStatus) {
    const roomUsers = this.socketService.clientLeaveRoom(
      payload.roomId,
      payload.userId,
    );
    socket.leave(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUsers);
  }

  @SubscribeMessage('userMute')
  userMute(@MessageBody() payload: IUserMediaStatus) {
    this.socketService.changeMuteStatus(payload.roomId, payload.userId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }

  @SubscribeMessage('videoPause')
  videoPause(@MessageBody() payload: IUserMediaStatus) {
    this.socketService.changeVideoPause(payload.roomId, payload.userId);
    const roomUser = this.socketService.getRoomUsers(payload.roomId);
    this.server.to(payload.roomId).emit('getUsers', roomUser);
  }
}
