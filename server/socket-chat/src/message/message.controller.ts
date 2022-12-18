import { Controller, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { IMessage } from './interfaces/IMessage';
//import IUpdateMessage from './interfaces/IUpdateMessage';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('message/add')
  async create(@Payload() createMessageDto: IMessage) {
    const res = await this.messageService
      .create(createMessageDto)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('message/getAllChat')
  async findAll(
    @Payload() userData: { chatId: string; page: number; limit: number },
  ) {
    const res = await this.messageService
      .getAllByChat(userData.chatId, userData.page, userData.limit)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('message/get')
  async findOne(@Payload() messageId: string) {
    const res = await this.messageService.getById(messageId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  // @MessagePattern('message/edit')
  // async update(@Payload() updateMessageDto: IUpdateMessage) {
  //   const res = await this.messageService
  //     .update(updateMessageDto)
  //     .catch((err) => {
  //       return {
  //         status: false,
  //         message: err.sqlMessage,
  //         httpCode: HttpStatus.BAD_REQUEST,
  //       };
  //     });
  //   return res;
  // }

  @MessagePattern('message/delete')
  async remove(@Payload() messageId: number) {
    const res = await this.messageService.remove(messageId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
