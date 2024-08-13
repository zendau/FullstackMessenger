import { Controller, HttpStatus, Logger, UseFilters } from '@nestjs/common';
import { RoomService } from './room.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Room } from './entities/room.entity';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
@Controller('room')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(private readonly roomService: RoomService) {}

  @MessagePattern('room/add')
  async create(@Payload() createRoomData: Room) {
    const res = await this.roomService.create(createRoomData);
    return res;
  }

  @MessagePattern('room/getByChat')
  async getByChatId(@Payload() chatId: string) {
    console.log(chatId);
    const res = await this.roomService.getByChatId(chatId);
    return res;
  }

  @MessagePattern('room/list')
  async findOne(@Payload() idList: string[]) {
    const res = await this.roomService.getByList(idList);
    return res;
  }

  @MessagePattern('room/edit')
  async update(@Payload() updateRoomData: Room) {
    const res = await this.roomService.update(updateRoomData);
    return res;
  }

  @MessagePattern('room/delete')
  async remove(@Payload() roomId: string) {
    const res = await this.roomService.remove(roomId);
    return res;
  }
}
