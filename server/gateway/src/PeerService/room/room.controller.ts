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
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { RoomDTO } from './dto/room.dto';
import { EditRoomDTO } from './dto/editRoom.dto';
import { JwtAuthGuard } from '../../AuthService/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/AuthService/enum/userRole.enum';

@ApiBearerAuth()
@ApiTags('Peer microservice - Room controller')
//@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  constructor(
    @Inject('PEER_SERVICE') private peerServiceClient: ClientProxy,
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Register new conference room' })
  @ApiResponse({ status: 200, type: EditRoomDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Post('add')
  async create(@Body() createRoomDto: RoomDTO) {
    const res = await firstValueFrom(
      this.peerServiceClient.send('room/add', createRoomDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get all conference rooms' })
  @ApiResponse({ status: 200, type: EditRoomDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  // @Roles(UserRole.Admin)
  // @UseGuards(RolesGuard)
  //@UseGuards(RoleGuard(UserRole.Admin))
  // @UseGuards(JwtAuthGuard)
  @Get('list')
  async findAll(@Query() requestData: { userId: number }) {
    const chatIdList = await firstValueFrom(
      this.chatServiceClient.send('chat/idList', 5),
    );

    console.log('chatList', chatIdList);

    if (chatIdList.status === false) {
      throw new HttpException(chatIdList.message, chatIdList.httpCode);
    }

    const roomsList = await firstValueFrom(
      this.peerServiceClient.send('room/list', chatIdList),
    );

    if (roomsList.status === false) {
      throw new HttpException(roomsList.message, roomsList.httpCode);
    }
    return roomsList;
  }

  @ApiOperation({ summary: 'Get conference room by roomId' })
  @ApiResponse({ status: 200, type: EditRoomDTO })
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
  @UsePipes(ValidationPipe)
  @Patch('edit')
  async update(@Body() updateRoomDto: EditRoomDTO) {
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
