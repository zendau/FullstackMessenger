import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomData: Room) {
    const resInsered = await this.roomRepository.save(createRoomData);
    return resInsered;
  }

  async getByChatId(chatId: string) {
    const chatData = await this.roomRepository
      .createQueryBuilder()
      .select('withVideo')
      .where('id = :chatId', { chatId })
      .getRawOne();

    return chatData?.withVideo === 1 ?? null;
  }

  async getByList(idList: string[]) {
    const chatData = await this.roomRepository
      .createQueryBuilder()
      .where('id IN (:idList)', { idList })
      .getMany();

    return chatData;
  }

  async update(updateRoomData: Room) {
    const res = await this.roomRepository
      .createQueryBuilder()
      .update()
      .set({
        withVideo: updateRoomData.withVideo,
      })
      .where('id = :id', { id: updateRoomData.id })
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
