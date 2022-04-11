import { Controller, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';

import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('message/add')
  async create(@Payload() createMessageDto: IMessageDTO) {
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
    @Payload() userData: { chatId: number; page: number; limit: number },
  ) {
    debugger;
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
  async findOne(@Payload() messageId: number) {
    const res = await this.messageService.getById(messageId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('message/edit')
  async update(@Payload() updateMessageDto: IUpdateMessageDTO) {
    const res = await this.messageService
      .update(updateMessageDto)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

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
