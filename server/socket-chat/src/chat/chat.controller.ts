import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto/chat.dto';
import { exitChatDto } from './dto/exitChat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('chat/getByUser')
  async getChats(@Payload() id: number) {
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

  @MessagePattern('chat/check')
  async checkChat(@Payload() chatData: ChatDTO) {
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

  @MessagePattern('chat/checkId')
  async checkChatId(@Payload() id: string) {
    const res = await this.chatService.getChatById(id).catch((err) => {
      console.log('err', err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    console.log('res', res);
    return res;
  }

  @MessagePattern('chat/create')
  async createChat(@Payload() chatData: ChatDTO) {
    const res = await this.chatService.createChat(chatData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    console.log('res', res);
    return res;
  }

  @MessagePattern('chat/getContacts')
  async getContacts() {
    const res = await this.chatService.getContacts().catch((err) => {
      return {
        status: false,
        message: err,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('chat/delete')
  async remove(@Payload() chatId: string) {
    const res = await this.chatService.remove(chatId).catch((err) => {
      console.log('err', err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('chat/groupUser')
  async getGroupUser(@Payload() chatId: string) {
    const res = await this.chatService.getGroupUsers(chatId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('chat/invaitedUsers')
  async getInvaitedUsers(@Payload() usersId: string[]) {
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

  @MessagePattern('chat/invaiteToChat')
  async invaiteUsersToChat(@Payload() invateData: UpdateChatDto) {
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

  @MessagePattern('chat/exitUser')
  async exitUserGroup(@Payload() exitUserDTO: exitChatDto) {
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
