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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';
import { MessageDTO } from '@/services/chat/message/dto/message.dto';
import { UpdateMessageDTO } from '@/services/chat/message/dto/update-message.dto';
import IChatPagination from '@/services/chat/interfaces/IChatPagination';

@ApiBearerAuth()
@ApiTags('Chat microservice - Message controller')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(@Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Add new message' })
  @ApiResponse({ status: 200, type: UpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Post('add')
  async create(@Body() createMessageDto: MessageDTO) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/add', createMessageDto),
    );

    return res;
  }

  @ApiOperation({ summary: 'Get all chat messages' })
  @ApiResponse({ status: 200, type: UpdateMessageDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('listPagination')
  async getMessagesPagination(@Query() paginationData: IChatPagination) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/listPagination', paginationData),
    );

    return res;
  }

  @ApiOperation({ summary: 'Get message by id' })
  @ApiResponse({ status: 200, type: UpdateMessageDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) messageId: number) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('message/get', messageId),
    );

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

    return res;
  }
}
