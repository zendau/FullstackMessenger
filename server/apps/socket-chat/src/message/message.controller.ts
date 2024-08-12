import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MessageService } from '@/message/message.service';
import { IMessage } from '@/message/interfaces/IMessage';
import IChatMessages from '@/socket/interfaces/chat/IChatMessages';

@Controller('message')
export class MessageController {
  private readonly logger = new Logger(MessageController.name);
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('message/add')
  async create(@Payload() createMessageDto: IMessage) {
    const res = await this.messageService
      .create(createMessageDto)
      .catch((err) => {
        this.logger.error(err.sqlMessage);
        return {
          status: false,
          message: 'error.unexpected',
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('message/listPagination')
  async getMessagesPagination(@Payload() loadData: IChatMessages) {
    const res = await this.messageService
      .getRoomMessages(loadData)
      .catch((err) => {
        this.logger.error(err.sqlMessage);
        return {
          status: false,
          message: 'error.unexpected',
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('message/get')
  async findOne(@Payload() messageId: string) {
    const res = await this.messageService.getById(messageId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('message/delete')
  async remove(@Payload() messageId: number) {
    const res = await this.messageService.remove(messageId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
