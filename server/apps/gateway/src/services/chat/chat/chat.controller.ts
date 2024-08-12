import {
  Controller,
  Get,
  Inject,
  HttpException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';
import { ChatDTO } from '@/services/chat/chat/dto/chat.dto';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';
import IChatPagination from '@/services/chat/interfaces/IChatPagination';
import IChatSearch from '@/services/chat/interfaces/IChatSearch';
import IUserChat from '@/services/chat/interfaces/IUserChat';
import IToken from '@/services/auth/UserModule/interfaces/IToken';
import IChatLoad from '@/services/chat/interfaces/IChatLoad';
import { ChatsListDTO } from '@/services/chat/chat/dto/chatsList.dto';
import { ChatUserDTO } from '@/services/chat/chat/dto/chatUser.dto';

@ApiBearerAuth()
@ApiTags('Chat microservice - chat controller')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(@Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Get chats by pagination' })
  @ApiResponse({
    status: 200,
    type: ChatsListDTO,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('listPagination')
  async getChatsPagination(
    @Query() paginationData: IChatPagination,
    @Req() request: Request & { user: IToken },
  ) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/listPagination', {
        ...paginationData,
        userId: request.user.id,
      }),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Search chats by patter' })
  @ApiResponse({
    status: 200,
    type: ChatDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('serch')
  async getChatsByPattern(
    @Query() searchData: IChatSearch,
    @Req() request: Request & { user: IToken },
  ) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/serch', {
        ...searchData,
        userId: request.user.id,
      }),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get chat by id' })
  @ApiResponse({
    status: 200,
    type: ChatDTO,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('byId')
  async loadChatById(
    @Query() loadData: IChatLoad,
    @Req() request: Request & { user: IToken },
  ) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/byId', {
        ...loadData,
        userId: request.user.id,
      }),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get free user`s list' })
  @ApiResponse({
    status: 200,
    type: ChatUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('freeUsers')
  async getFreeChatUsers(
    @Query() chatData: IUserChat,
    @Req() request: Request & { user: IToken },
  ) {
    const res = await firstValueFrom(
      this.chatServiceClient.send('chat/freeUsers', {
        ...chatData,
        userId: request.user.id,
      }),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get free user`s list' })
  @ApiResponse({
    status: 200,
    description: 'Private chat is exist',
  })
  @ApiResponse({
    status: 400,
    description: 'Private chat is`n exist',
    type: HttpErrorDTO,
  })
  @Get('checkPrivate')
  async checkPrivateChat(
    @Query() privateData: { contactId: number },
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.chatServiceClient.send('chat/checkPrivate', {
        ...privateData,
        userId: request.user.id,
      }),
    );
    console.log('RES d', resData);
    if (resData?.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData ?? false;
  }
}
