import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { editRoomDTO } from './dto/editRoom.dto';
import { roomDTO } from './dto/room.dto';
import { Room } from './entities/room.entity';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @Inject('AUTH_SERVICE') private authServiceClient: ClientProxy,
  ) {}

  async create(createRoomDTO: roomDTO) {
    const resInsered = await this.roomRepository.save(createRoomDTO);
    return resInsered;
  }

  async getAll() {
    return await this.roomRepository.createQueryBuilder().getMany();
  }

  async getById(roomId: string) {
    const chatData = await this.roomRepository
      .createQueryBuilder()
      .where('id = :roomId', { roomId })
      .getOne();

    if (chatData === undefined)
      return {
        status: false,
        message: `roomId ${roomId} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    const userData = await firstValueFrom(
      this.authServiceClient.send('user/id', chatData.adminId),
    );
    if (userData.status === false) {
      return {
        status: false,
        message: `adminId ${chatData.adminId} is not found`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    return Object.assign(chatData, { adminLogin: userData.login });
  }

  async update(updateRoomDTO: editRoomDTO) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .update()
      .set({
        roomTitle: updateRoomDTO.roomTitle,
        roomWithVideo: updateRoomDTO.roomWithVideo,
      })
      .where(`id = :id`, { id: updateRoomDTO.id })
      .execute();

    return !!res.affected;
  }

  async remove(id: string) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return !!res.affected;
  }
}
