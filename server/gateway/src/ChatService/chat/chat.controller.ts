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
import { firstValueFrom } from 'rxjs';
import { ChatDTO } from './dto/chat.dto';
import { exitChatDto } from './dto/exitChat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}
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

  @Post('check')
  async checkChat(@Body() chatData: ChatDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/check', chatData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

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
        path: res.chatId,
      }),
    );
    if (resFileInsert.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

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

  @Get('invaitedUsers')
  async getInvaitedUsers(@Query('userData') usersId: string[]) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/invaitedUsers', usersId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Patch('invaiteToChat')
  async invaiteUsersToChat(@Body() invateData: UpdateChatDto) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/invaiteToChat', invateData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Delete('exitUser')
  async exitUserGroup(@Query() exitUserDTO: exitChatDto) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/exitUser', exitUserDTO),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
