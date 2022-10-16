import { UserIdDTO } from './dto/id.dto';
import { GetUserDTO } from './../ResponseDTO/getUser.dto';
//import { ValidationPipe } from '../../pipes/validation.pipe';
import { RegisterDTO } from './dto/register.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Headers,
  createParamDecorator,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { firstValueFrom } from 'rxjs';
import { LoginDTO } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '../ResponseDTO/httpError.dto';

import { IConfirmData } from './interfaces/IConfirmData';
import { EditData } from './dto/edit.dto';

import HttpCacheInterceptor from '../../Cache/HttpCacheInterceptor';
import HttpClearCacheInterceptor from '../../Cache/clearCache';
import { authSuccessDTO } from '../ResponseDTO/authSuccess.dto';

import BodyWithDevice from '../decorators/BodyWithDevice.decorator';
import RefreshData from '../decorators/RefreshData.decorator';
import { UserRole } from './interfaces/IUserRole';
import IContact from './interfaces/IContact';
import { ContactDTO } from '../ResponseDTO/contact.dto';

@ApiTags('Auth microservice - Contact controller')
@Controller('contact')
export class ContactController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @Get('list/:userId')
  @ApiOperation({ summary: 'Get contact list' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  async getUserContactList(@Param('userId') userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/list', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Get('freeList/:userId')
  @ApiOperation({ summary: 'Get users list who are not added to contacts' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  async getFreeUserList(@Param('userId') userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/freeList', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Post('sendRequest')
  @ApiOperation({ summary: 'Send contact request to user' })
  @ApiResponse({
    status: 200,
    description: 'success sended requests'
  })
  @ApiResponse({
    status: 400,
    description: 'error when adding to contacts',
    type: HttpErrorDTO,
  })
  async sendContactRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/sendRequest', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Get('pending/:userId')
  @ApiOperation({ summary: 'Get users pending requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  async getContactsRequestPending(@Param('userId') userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/pending', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Get('outgoing/:userId')
  @ApiOperation({ summary: 'Get users outgoing requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  async getContactsRequestOutgoing(@Param('userId') userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/outgoing', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm contact request' })
  @ApiResponse({
    status: 200,
    description: 'success confirm request'
  })
  @ApiResponse({
    status: 400,
    description: 'error when confirming request',
    type: HttpErrorDTO,
  })
  async confirmUserRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/confirm', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Post('reject')
  @ApiOperation({ summary: 'Reject contact request' })
  @ApiResponse({
    status: 200,
    description: 'success reject request'
  })
  @ApiResponse({
    status: 400,
    description: 'error when rejecting request',
    type: HttpErrorDTO,
  })
  async rejectUserRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/reject', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete user from contact' })
  @ApiResponse({
    status: 200,
    description: 'success deleted user operation'
  })
  @ApiResponse({
    status: 400,
    description: 'error when deleting user',
    type: HttpErrorDTO,
  })
  async deleteUserFromContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/delete', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('block')
  @ApiOperation({ summary: 'Block selected user' })
  @ApiResponse({
    status: 200,
    description: 'success blocking user'
  })
  @ApiResponse({
    status: 400,
    description: 'error when blocking user',
    type: HttpErrorDTO,
  })
  async blockUserContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/block', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('unBlock')
  @ApiOperation({ summary: 'unblock selected user' })
  @ApiResponse({
    status: 200,
    description: 'success unblock user'
  })
  @ApiResponse({
    status: 400,
    description: 'error when unblocing user',
    type: HttpErrorDTO,
  })
  async unBlockUserContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/unBlock', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
