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
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/AuthService/guards/jwt-auth.guard';
import { HttpErrorDTO } from 'src/AuthService/ResponseDTO/httpError.dto';
import { MessageDTO } from './dto/message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';

@ApiBearerAuth()
@ApiTags('Chat microservice - Message controller')
//@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Add new message' })
  @ApiResponse({ status: 200, type: UpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Post('add')
  async create(@Body() createMessageDto: MessageDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/add', createMessageDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get all chat messages' })
  @ApiResponse({ status: 200, type: UpdateMessageDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getAllChat/:id')
  async findAll(
    @Param('id', ParseIntPipe) chatId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
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
  @ApiResponse({ status: 200, type: UpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) messageId: number) {
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
  @UsePipes(ValidationPipe)
  @Patch('edit')
  async update(@Body() updateMessageDto: UpdateMessageDTO) {
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
  async remove(@Param('id', ParseIntPipe) messageId: number) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/delete', messageId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
