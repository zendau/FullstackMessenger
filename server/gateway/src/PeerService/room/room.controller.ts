import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { roomDTO } from './dto/room.dto';
import { editRoomDTO } from './dto/editRoom.dto';
import { JwtAuthGuard } from '../../AuthService/guards/jwt-auth.guard';

@Controller('room')
export class RoomController {
  constructor(@Inject('PEER_SERVICE') private peerServiceClient: ClientProxy) {}

  @Post('add')
  async create(@Body() createRoomDto: roomDTO) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/add', createRoomDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async findAll() {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/getAll', ''),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Get('get/:id')
  async findOne(@Param('id') roomId: string) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/get', roomId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Patch('edit')
  async update(@Body() updateRoomDto: editRoomDTO) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/edit', updateRoomDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') roomId: number) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/delete', roomId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
