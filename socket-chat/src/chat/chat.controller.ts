import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('getByUser/:id')
  async getChats(@Param('id') id: number) {
    const res = await this.chatService.getChats(id).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Post('check')
  async checkChat(@Body() chatData: ChatDTO) {
    const res = await this.chatService.checkChat(chatData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('checkId/:id')
  async checkChatId(@Param('id') id: string) {
    const res = await this.chatService.getById(id).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Post('create')
  async createChat(@Body() chatData: ChatDTO) {
    const res = await this.chatService.createChat(chatData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('getContacts')
  async getContacts() {
    const res = await this.chatService.getContacts().catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') chatId: number) {
    const res = await this.chatService.remove(chatId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
