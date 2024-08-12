import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { RoomService } from './room.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Room } from './entities/room.entity';

@Controller('room')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(private readonly roomService: RoomService) {}

  @MessagePattern('room/add')
  async create(@Payload() createRoomData: Room) {
    const res = await this.roomService.create(createRoomData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/getByChat')
  async getByChatId(@Payload() chatId: string) {
    console.log(chatId);
    const res = await this.roomService.getByChatId(chatId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/list')
  async findOne(@Payload() idList: string[]) {
    const res = await this.roomService.getByList(idList).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/edit')
  async update(@Payload() updateRoomData: Room) {
    const res = await this.roomService.update(updateRoomData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/delete')
  async remove(@Payload() roomId: string) {
    const res = await this.roomService.remove(roomId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
