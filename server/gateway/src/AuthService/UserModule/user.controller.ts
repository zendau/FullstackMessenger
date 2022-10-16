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

@ApiTags('Auth microservice - User controller')
@Controller('user')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: authSuccessDTO })
  @ApiResponse({
    status: 400,
    description: 'Wrong register',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(
    @BodyWithDevice() authBody: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/register', authBody),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return resData;
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: authSuccessDTO })
  @ApiResponse({ status: 400, description: 'Wrong auth', type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @BodyWithDevice() authBody: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/login', authBody),
    );
    console.log(resData);
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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

    res.cookie('auth-cookie', resData.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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
  //@UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('all')
  async getAllUsers() {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/all', ''),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
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
  async getUserById(@Param('id') id: number) {
    console.log('test');
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/id', id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpClearCacheInterceptor)
  @ApiOperation({ summary: 'set banned status for user by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  @Patch('blockUser')
  async blockUser(@Body() userData: UserIdDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/blockUser', userData.id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'set activate status for user by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  @Patch('unBlockUser')
  async unBlockUser(@Body() userData: UserIdDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/unBlockUser', userData.id),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'register confirm code' })
  @ApiResponse({ status: 200, description: 'true register confirm code' })
  @ApiResponse({ status: 400, description: 'false register confirm code' })
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

  @ApiBearerAuth()
  @Patch('editData')
  @ApiOperation({ summary: 'edit user data' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  async editUserData(
    @Res({ passthrough: true }) res: Response,
    @Body() editData: EditData,
  ) {
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
  async resetUserPassword(
    @Res({ passthrough: true }) res: Response,
    @Body()
    resetData: {
      email: string;
      confirmCode: string;
    },
  ) {
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

  @Patch('setRole')
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
  async setUserRole(
    @Body()
    roleData: {
      userId: number;
      role: UserRole;
    },
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/setRole', roleData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
