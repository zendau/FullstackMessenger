import { GetUserDTO } from '@/AuthService/ResponseDTO/getUser.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '@/AuthService/guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '@/AuthService/ResponseDTO/httpError.dto';
import { ContactDTO } from '@/AuthService/ResponseDTO/contact.dto';
import IUserPaginationList from '@/AuthService/UserModule/interfaces/IUserPaginationList';
import IContact from '@/AuthService/UserModule/interfaces/IContact';
import IUserChat from '@/ChatService/interfaces/IUserChat';
import IToken from '@/AuthService/UserModule/interfaces/IToken';
import { ContactStatusesDTO } from '@/AuthService/ResponseDTO/contactStatuses.dto';

@ApiBearerAuth()
@ApiTags('Auth microservice - Contact controller')
@UseGuards(JwtAuthGuard)
@Controller('contact')
export class ContactController {
  constructor(
    @Inject('AUTH_SERVICE') private authServiceClient: ClientProxy,
    @Inject('CHAT_SERVICE') private chatServiceClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Get contact list' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('list')
  async getUserContactList(
    @Query() listData: IUserPaginationList,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.chatServiceClient.send('chat/contacts', {
        ...listData,
        userId: request.user.id,
      }),
    );
    console.log('resData', resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users list who are not added to contacts' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('freeList')
  async getFreeUserList(
    @Query() listData: IUserPaginationList,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/freeList', {
        ...listData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'User`s contact statuses count' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('getContactCount')
  async getUserContactsCount(@Req() request: Request & { user: IToken }) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/getContactCount', request.user.id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Send contact request to user' })
  @ApiResponse({
    status: 200,
    description: 'success sended requests',
  })
  @ApiResponse({
    status: 400,
    description: 'error when adding to contacts',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('sendRequest')
  async sendContactRequest(
    @Body() requestData: IContact,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/sendRequest', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users pending requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('pending')
  async getContactsRequestPending(
    @Query() listData: IUserPaginationList,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/pending', {
        ...listData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users outgoing requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('outgoing')
  async getContactsRequestOutgoing(
    @Query() listData: IUserPaginationList,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/outgoing', {
        ...listData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Confirm contact request' })
  @ApiResponse({
    status: 200,
    description: 'success confirm request',
  })
  @ApiResponse({
    status: 400,
    description: 'error when confirming request',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('confirm')
  async confirmUserRequest(
    @Body() requestData: IContact,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/confirm', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Reject contact request' })
  @ApiResponse({
    status: 200,
    description: 'success reject request',
  })
  @ApiResponse({
    status: 400,
    description: 'error when rejecting request',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('reject')
  async rejectUserRequest(
    @Body() requestData: IContact,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/reject', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Delete user from contact' })
  @ApiResponse({
    status: 200,
    description: 'success deleted user operation',
  })
  @ApiResponse({
    status: 400,
    description: 'error when deleting user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Delete('delete')
  async deleteUserFromContact(
    @Query() requestData: IContact,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/delete', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get bloked users' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  @Get('blockedUsers')
  async getBlockedUsers(
    @Query() listData: IUserPaginationList,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/blockedUsers', {
        ...listData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Block selected user' })
  @ApiResponse({
    status: 200,
    description: 'success blocking user',
  })
  @ApiResponse({
    status: 400,
    description: 'error when blocking user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Patch('block')
  async blockUserContact(
    @Body() requestData: IContact,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/block', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'unblock selected user' })
  @ApiResponse({
    status: 200,
    description: 'success unblock user',
  })
  @ApiResponse({
    status: 400,
    description: 'error when unblocing user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Patch('unBlock')
  async unBlockUserContact(
    @Body() requestData: ContactDTO,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/unblock', {
        ...requestData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get contact statuses' })
  @ApiResponse({
    status: 200,
    type: ContactStatusesDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'error when get statuses',
    type: HttpErrorDTO,
  })
  @Get('contactData')
  async getContactData(
    @Query() contactData: IUserChat,
    @Req() request: Request & { user: IToken },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/getContactData', {
        ...contactData,
        userId: request.user.id,
      }),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
