import { Injectable } from '@nestjs/common';
import IUser from './interfaces/IUser';

@Injectable()
export class SocketService {
  private rooms = new Map<string, Map<string, IUser>>();

  getRoomUsers(roomId: string) {
    return this.roomDTO(this.rooms.get(roomId));
  }

  clientLeaveRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.delete(userId);

    return this.roomDTO(room);
  }

  clientJoinRoom(
    userId: string,
    userLogin: string,
    roomId: string,
    peerId: string,
  ) {
    const isRoomExist = this.rooms.has(roomId);

    const userRoomData = {
      userLogin,
      roomId,
      peerId,
      mute: false,
      pause: false,
    };

    if (isRoomExist) {
      this.rooms.get(roomId).set(userId, userRoomData);
    } else {
      const usersMap = new Map([[userId, userRoomData]]);

      this.rooms.set(roomId, usersMap);
    }

    return this.roomDTO(this.rooms.get(roomId));
  }

  changeMuteStatus(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);

    if (room.has(userId)) {
      room.get(userId).mute = !room.get(userId).mute;
    }

    return this.roomDTO(room);
  }

  changeVideoPause(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);

    if (room.has(userId)) {
      room.get(userId).pause = !room.get(userId).pause;
    }

    return this.roomDTO(room);
  }

  roomDTO(roomData) {
    return JSON.stringify([...roomData]);
  }
}
