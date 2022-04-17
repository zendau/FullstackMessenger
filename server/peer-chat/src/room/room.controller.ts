import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { roomDTO } from './dto/room.dto';
import { editRoomDTO } from './dto/editRoom.dto';
import { Response } from 'express';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('add')
  async create(@Body() createRoomDto: roomDTO, @Res() response: Response) {
    console.log(createRoomDto);
    const res = await this.roomService.create(createRoomDto).catch((err) => {
      response.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      });
    });
    response.send(res);
  }

  @Get('getAll')
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

  @Get('get/:id')
  async findOne(@Param('id') roomId: string) {
    const res = await this.roomService.getById(roomId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Patch('edit')
  async update(@Body() updateRoomDto: editRoomDTO) {
    const res = await this.roomService.update(updateRoomDto).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') roomId: number) {
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
