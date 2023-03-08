import { GetUserDTO } from './../ResponseDTO/getUser.dto';
import { UserRegisterDTO } from './dto/userRegister.dto';
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
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { firstValueFrom } from 'rxjs';
import { UserLoginDTO } from './dto/userLogin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '../ResponseDTO/httpError.dto';

import { ConfirmDataDTO } from './dto/confirmData.dto';
import { EditDataDTO } from './dto/userEdit.dto';

import HttpCacheInterceptor from '../../Cache/HttpCacheInterceptor';
import { authSuccessDTO } from '../ResponseDTO/authSuccess.dto';

import BodyWithDevice from '../decorators/BodyWithDevice.decorator';
import RefreshData from '../decorators/RefreshData.decorator';
import { UserResetPasswordDTO } from './dto/userResetPassword.dto';

@ApiTags('Auth microservice - User controller')
@Controller('user')
export class UserController {
  private cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: authSuccessDTO })
  @ApiResponse({
    status: 400,
    description: 'Wrong register',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(
    @BodyWithDevice() authBody: UserRegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/register', authBody),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, this.cookieOptions);
    return resData;
  }

  // TODO: add api dock
  @UsePipes(ValidationPipe)
  @Post('checkEmail')
  async checkUserEmail(@Body() checkData: { email: string }) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/checkEmail', checkData.email),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }
    return resData;
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: authSuccessDTO })
  @ApiResponse({ status: 400, description: 'Wrong auth', type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @BodyWithDevice() authBody: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/login', authBody),
    );
    console.log(resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, this.cookieOptions);
    return resData;
  }

  @ApiCookieAuth('auth-cookie')
  @ApiOperation({ summary: 'Refresh JWT access' })
  @ApiResponse({ status: 200, type: authSuccessDTO })
  @ApiResponse({
    status: 400,
    description: 'wrong auth-cookue',
    type: HttpErrorDTO,
  })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @RefreshData('auth-cookie') refreshData,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/refresh', refreshData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, this.cookieOptions);
    return resData;
  }

  @Get('logout')
  @ApiOperation({ summary: 'logout user' })
  @ApiResponse({ status: 200, description: 'success logout' })
  @ApiResponse({
    status: 400,
    description: 'wrong auth-cookie',
    type: HttpErrorDTO,
  })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, type: GetUserDTO })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtRefreshGuard)
  @Get('getById/:id')
  @UseInterceptors(HttpCacheInterceptor)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/id', id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'register confirm code' })
  @ApiResponse({ status: 200, description: 'true register confirm code' })
  @ApiResponse({ status: 400, description: 'false register confirm code' })
  @UsePipes(ValidationPipe)
  @Post('setConfirmCode')
  async getCodeEditData(@Body() confirmData: ConfirmDataDTO) {
    console.log('confirmData', confirmData);

    const resData = await firstValueFrom(
      this.authServiceClient.send('user/setConfirmCode', confirmData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'edit user data' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtRefreshGuard)
  @Patch('editData')
  async editUserData(@Body() editData: EditDataDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/editData', editData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }
    return resData;
  }

  @ApiOperation({ summary: 'reset user password' })
  @ApiResponse({
    status: 200,
    description: 'Success operation, new password send to user email',
  })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtRefreshGuard)
  @Patch('resetPassword')
  async resetUserPassword(
    @Res({ passthrough: true }) res: Response,
    @Body()
    resetData: UserResetPasswordDTO,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/resetPassword', resetData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true });
    return resData;
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, type: GetUserDTO })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtRefreshGuard)
  @Get('getDevicesData/:id')
  async getTokensDeviceData(@Param('id', ParseIntPipe) id: number) {
    console.log('id', id);
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/getTokensDeviceData', id),
    );
    console.log('resData', resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
