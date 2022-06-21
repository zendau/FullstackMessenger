import { SuccessCheckChatDTO } from './dto/successCheckChat.dto';
import { CheckChatDTO } from './dto/checkChat.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpErrorDTO } from 'src/AuthService/ResponseDTO/httpError.dto';
import { ChatDTO } from './dto/chat.dto';
import { UserChatUpdateStatusDto } from './dto/UserChatUpdateStatus.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { CheckChatIdDTO } from './dto/checkChatId.dto';
import { GetUserDTO } from 'src/AuthService/ResponseDTO/getUser.dto';
import { UsersIdDTO } from './dto/usersId.dto';

@ApiBearerAuth()
@ApiTags('Chat microservice - chat controller')
@Controller('chat')
export class ChatController {
  constructor(
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  
  @ApiOperation({ summary: 'Get all user chats' })
  @ApiResponse({ status: 200, type: UpdateChatDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getByUser/:id')
  async getChats(@Param('id') id: number) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/getByUser', id),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Check chat with selected user was created' })
  @ApiResponse({ status: 200, type: SuccessCheckChatDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Post('check')
  async checkChat(@Body() chatData: CheckChatDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/check', chatData),
    );
    console.log('res', res)
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Check chat id' })
  @ApiResponse({ status: 200, type: CheckChatIdDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('checkId/:id')
  async checkChatId(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/checkId', id),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Create new chat' })
  @ApiResponse({ status: 200, type: CheckChatIdDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Post('create')
  async createChat(@Body() chatData: ChatDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/create', chatData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }

    const resFileInsert = await firstValueFrom(
      this.fileServiceClient.send('foulder/add', {
        path: res.id,
      }),
    );
    if (resFileInsert.status === false) {
      console.log('resFile', resFileInsert)
      throw new HttpException(res.message, res.httpCode);
    }
    console.log('res', res);
    return res;
  }
  
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getContacts')
  async getContacts() {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/getContacts', ''),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  
  @ApiOperation({ summary: 'Delete chat by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('delete/:id')
  async remove(@Param('id') chatId: string) {
    console.log('id', chatId);
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/delete', chatId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get all chat group users' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('groupUser/:id')
  async getGroupUser(@Param('id') chatId: string) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/groupUser', chatId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  
  @ApiOperation({ summary: 'Get all invaited users to chat group' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Post('invaitedUsers')
  async getInvaitedUsers(@Body()  userData: UsersIdDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/invaitedUsers', userData.users),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Invate to chat group' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Patch('invaiteToChat')
  async invaiteUsersToChat(@Body() invateData: UserChatUpdateStatusDto) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/invaiteToChat', invateData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Exit user from chat' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('exitUser')
  async exitUserGroup(@Query() exitUserDTO: UserChatUpdateStatusDto) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/exitUser', exitUserDTO),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
