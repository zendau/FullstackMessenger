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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpErrorDTO } from 'src/AuthService/ResponseDTO/httpError.dto';
import { IMessageDTO } from './dto/message.dto';
import { IUpdateMessageDTO } from './dto/update-message.dto';

@ApiBearerAuth()
@ApiTags('Chat microservice - Message controller')
@Controller('message')
export class MessageController {
  constructor(
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Add new message' })
  @ApiResponse({ status: 200, type: IUpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Get all chat messages' })
  @ApiResponse({ status: 200, type: IUpdateMessageDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

    if (res.length === 0) return res;

    const resWithFileData = await firstValueFrom(
      this.fileServiceClient.send('file/messagesFileData', res),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return resWithFileData;
  }

  @ApiOperation({ summary: 'Get message by id' })
  @ApiResponse({ status: 200, type: IUpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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


  @ApiOperation({ summary: 'Edit message by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  
  @ApiOperation({ summary: 'Delete message by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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
