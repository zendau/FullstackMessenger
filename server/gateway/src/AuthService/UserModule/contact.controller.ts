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

@ApiTags('Auth microservice - Contact controller')
@Controller('contact')
export class ContactController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @Get('list/:userId')
  // @ApiOperation({ summary: 'reset user password' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Success operation, new password send to user email',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'user not found',
  //   type: HttpErrorDTO,
  // })
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
  // @ApiOperation({ summary: 'reset user password' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Success operation, new password send to user email',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'user not found',
  //   type: HttpErrorDTO,
  // })
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
  async sendContactRequest(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/sendRequest', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Get('pending/:userId')
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
  async confirmUserRequest(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/confirm', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Post('reject')
  async rejectUserRequest(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/reject', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Delete('delete')
  async deleteUserFromContact(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/delete', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('block')
  async blockUserContact(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/block', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('unBlock')
  async unBlockUserContact(@Body() requestData: IContact) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/unBlock', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
