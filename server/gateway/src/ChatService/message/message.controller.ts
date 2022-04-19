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
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  @Post('add')
  async create(@Body() createMessageDto: IMessageDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/add', createMessageDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
  @Get('getAllChat/:id')
  async findAll(
    @Param('id') chatId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/getAllChat', {
        chatId,
        page,
        limit,
      }),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }

    const resWithFileData = await firstValueFrom(
      this.fileServiceClient.send('file/messagesFileData', res),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return resWithFileData;
  }

  @Get('get/:id')
  async findOne(@Param('id') messageId: number) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/get', messageId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Patch('edit')
  async update(@Body() updateMessageDto: IUpdateMessageDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/edit', updateMessageDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') messageId: number) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/delete', messageId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
