import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('add')
  async create(
    @Body() createMessageDto: IMessageDTO,
    @Res() response: Response,
  ) {
    const res = await this.messageService
      .create(createMessageDto)
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).send({
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        });
      });
    response.send(res);
  }

  @Get('getAllChat/:id')
  async findAll(
    @Param('id') chatId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const res = await this.messageService
      .getAllByChat(chatId, page, limit)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @Get('get/:id')
  async findOne(@Param('id') messageId: number) {
    const res = await this.messageService.getById(messageId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Patch('edit')
  async update(@Body() updateMessageDto: IUpdateMessageDTO) {
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

  @Delete('delete/:id')
  async remove(@Param('id') messageId: number) {
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
