import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto/chat.dto';
import { exitChatDto } from './dto/exitChat.dto';
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
    const res = await this.chatService.getChatById(id).catch((err) => {
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

  @Get('groupUser/:id')
  async getGroupUser(@Param('id') chatId: string) {
    const res = await this.chatService.getGroupUsers(chatId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('invaitedUsers')
  async getInvaitedUsers(@Query('userData') usersId: string[]) {
    const res = await this.chatService
      .getInvaitedUsers(usersId)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @Patch('invaiteToChat')
  async invaiteUsersToChat(@Body() invateData: UpdateChatDto) {
    const res = await this.chatService
      .invaiteUsersToChat(invateData)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @Delete('exitUser')
  async exitUserGroup(@Query() exitUserDTO: exitChatDto) {
    console.log(exitUserDTO);
    const res = await this.chatService
      .exitUserGroup(exitUserDTO)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }
}
