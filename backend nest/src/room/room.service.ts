import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { IEditRoomDTO } from './dto/editRoom.dto';
import { IRoomDTO } from './dto/room.dto';
import { Room } from './entities/room.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDTO: IRoomDTO) {
    const resInsered = await this.roomRepository.save({
      ...createRoomDTO,
      roomId: uuidv4(),
    });
    return resInsered;
  }

  async getAll() {
    return await this.roomRepository.createQueryBuilder().getMany();
  }

  async getById(id: number) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();

    if (res === undefined)
      return {
        status: false,
        message: `id ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateRoomDTO: IEditRoomDTO) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .update()
      .set({
        adminLogin: updateRoomDTO.adminLogin,
        roomId: uuidv4(),
        roomTitle: updateRoomDTO.roomTitle,
      })
      .where(`id = ${updateRoomDTO.id}`)
      .execute();

    return !!res.affected;
  }

  async remove(id: number) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${id}`)
      .execute();

    return !!res.affected;
  }
}
