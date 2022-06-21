import { Controller, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { roomDTO } from './dto/room.dto';
import { editRoomDTO } from './dto/editRoom.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @MessagePattern('room/add')
  async create(@Payload() createRoomDto: roomDTO) {
    console.log(createRoomDto);
    const res = await this.roomService.create(createRoomDto).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/getAll')
  async findAll() {
    const res = await this.roomService.getAll().catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/get')
  async findOne(@Payload() roomId: string) {
    console.log(roomId);
    const res = await this.roomService.getById(roomId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/edit')
  async update(@Payload() updateRoomDto: editRoomDTO) {
    console.log(updateRoomDto);
    const res = await this.roomService.update(updateRoomDto).catch((err) => {
      console.log('err', err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('room/delete')
  async remove(@Payload() roomId: string) {
    const res = await this.roomService.remove(roomId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
