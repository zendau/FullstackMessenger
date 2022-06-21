import RoleGuard from './../../AuthService/guards/roles.guard';
import { HttpErrorDTO } from './../../AuthService/ResponseDTO/httpError.dto';
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/AuthService/enum/role.enum';

@ApiBearerAuth()
@ApiTags('Peer microservice - Room controller')
@Controller('room')
export class RoomController {
  constructor(@Inject('PEER_SERVICE') private peerServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Register new conference room' })
  @ApiResponse({ status: 200, type: editRoomDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Get all conference rooms' })
  @ApiResponse({ status: 200, type: editRoomDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  @UseGuards(RoleGuard(Role.Admin))
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

  @ApiOperation({ summary: 'Get conference room by roomId' })
  @ApiResponse({ status: 200, type: editRoomDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Edit conference room data' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Delete conference room by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('delete/:id')
  async remove(@Param('id') roomId: string) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/delete', roomId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
