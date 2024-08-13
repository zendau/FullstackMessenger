import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MessageService } from '@/message/message.service';
import { IMessage } from '@/message/interfaces/IMessage';
import IChatMessages from '@/socket/interfaces/chat/IChatMessages';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
@Controller('message')
export class MessageController {
  private readonly logger = new Logger(MessageController.name);
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('message/add')
  async create(@Payload() createMessageDto: IMessage) {
    const res = await this.messageService.create(createMessageDto);

    return res;
  }

  @MessagePattern('message/listPagination')
  async getMessagesPagination(@Payload() loadData: IChatMessages) {
    const res = await this.messageService.getRoomMessages(loadData);

    return res;
  }

  @MessagePattern('message/get')
  async findOne(@Payload() messageId: string) {
    const res = await this.messageService.getById(messageId);
    return res;
  }

  @MessagePattern('message/delete')
  async remove(@Payload() messageId: number) {
    const res = await this.messageService.remove(messageId);
    return res;
  }
}
