//import { ValidationPipe } from '../../pipes/validation.pipe';
import { RegisterData } from './dto/register.dto';
import {
  Body,
  CacheInterceptor,
  CacheKey,
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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { firstValueFrom } from 'rxjs';
import { LoginData } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorDTO } from '../dto/httpError.dto';

import IConfirmData from './interfaces/IConfirmData'
import { EditData } from './dto/edit.dto';

import HttpCacheInterceptor from '../../Cache/HttpCacheInterceptor'
import HttpClearCacheInterceptor from '../../Cache/clearCache'

@ApiTags('Auth microservice - User controller')
@Controller('user')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) { }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, type: RegisterData })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Post('register')
  async register(
    @Body() authBody: RegisterData,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(authBody);
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/register', authBody),
    );
    console.log(resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    return resData;
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginData })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() authBody: LoginData,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/login', authBody),
    );
    console.log(resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    return resData;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authCookie = request.cookies['auth-cookie'];

    const resData = await firstValueFrom(
      this.authServiceClient.send('user/refresh', authCookie),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    return resData;
  }

  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authCookie = request.cookies['auth-cookie'];

    if (authCookie) {
      const resData = await firstValueFrom(
        this.authServiceClient.send('user/logout', authCookie),
      );
      if (resData.status === false) {
        throw new HttpException(resData.message, resData.httpCode);
      }
    }

    res.clearCookie('auth-cookie');
    return true;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('all')
  async getAllUsers(@Req() request: Request,) {

    const resData = await firstValueFrom(
      this.authServiceClient.send('user/all', ''),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @UseGuards(JwtAuthGuard)
  //@UseGuards(JwtRefreshGuard)
  @Get('getById/:id')
  @UseInterceptors(HttpCacheInterceptor)
  async getUserById(@Param('id') id: number) {
    console.log('test')
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/id', id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpClearCacheInterceptor)
  @Patch('blockUser')
  async blockUser(@Body() userData: {
    userId: number
  }) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/blockUser', userData.userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('unBlockUser')
  async unBlockUser(@Body() userData: {
    userId: number
  }) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/unBlockUser', userData.userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Post('setConfirmCode')
  async getCodeEditData(@Body() confirmData: IConfirmData) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/setConfirmCode', confirmData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @Patch('editData')
  async editUserData(
    @Res({ passthrough: true }) res: Response,
    @Body() editData: EditData) {
    console.log(editData);
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/editData', editData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }
    return resData;
  }

  @Patch('resetPassword')
  async resetUserPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() resetData:
      {
        email: string
        confirmCode: string
      }) {
    console.log(resetData);
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/resetPassword', resetData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true });
    return resData;
  }


  @Get('test')
  async test() {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/test', ''),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
