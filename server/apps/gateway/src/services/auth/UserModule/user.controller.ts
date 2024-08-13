import { GetUserDTO } from '@/services/auth/ResponseDTO/getUser.dto';
import { UserRegisterDTO } from '@/services/auth/UserModule/dto/userRegister.dto';
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
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@/services/auth/guards/jwt-refresh.guard';
import { firstValueFrom } from 'rxjs';
import { UserLoginDTO } from '@/services/auth/UserModule/dto/userLogin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';

import { ConfirmDataDTO } from '@/services/auth/UserModule/dto/confirmData.dto';
import { EditDataDTO } from '@/services/auth/UserModule/dto/userEdit.dto';

import HttpCacheInterceptor from '@/cache/HttpCacheInterceptor';
import { authSuccessDTO } from '@/services/auth/ResponseDTO/authSuccess.dto';

import BodyWithDevice from '@/services/auth/decorators/BodyWithDevice.decorator';
import RefreshData from '@/services/auth/decorators/RefreshData.decorator';
import { UserResetPasswordDTO } from '@/services/auth/UserModule/dto/userResetPassword.dto';
import IToken from '@/services/auth/UserModule/interfaces/IToken';
import { ExceptionsFilter } from '../../../common/filters/exception.filter';

@ApiTags('Auth microservice - User controller')
@UseFilters(new ExceptionsFilter())
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

    res.cookie('auth-cookie', resData.refreshToken, this.cookieOptions);
    return resData;
  }

  @ApiOperation({ summary: 'Check user email' })
  @ApiResponse({ status: 200, description: 'True email data' })
  @ApiResponse({
    status: 400,
    description: 'Error check email',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  @Post('checkEmail')
  async checkUserEmail(@Body() checkData: { email: string }) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/checkEmail', checkData.email),
    );
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
      await firstValueFrom(
        this.authServiceClient.send('user/logout', authCookie),
      );
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
  @Get('getById/:id')
  @UseInterceptors(HttpCacheInterceptor)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/id', id),
    );

    return resData;
  }

  @ApiOperation({ summary: 'register confirm code' })
  @ApiResponse({ status: 200, description: 'true register confirm code' })
  @ApiResponse({ status: 400, description: 'false register confirm code' })
  @UsePipes(ValidationPipe)
  @Post('setConfirmCode')
  async getCodeEditData(@Body() confirmData: ConfirmDataDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/setConfirmCode', confirmData),
    );

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
  @UseGuards(JwtAuthGuard)
  @Patch('editData')
  async editUserData(
    @Req() request: Request & { user: IToken },
    @BodyWithDevice() editData: EditDataDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const editUserData = {
      ...editData,
      ...(editData.email && { newEmail: editData.email }),
      email: request.user.email,
      id: request.user.id,
      tokenData: request.user,
    };
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/editData', editUserData),
    );

    res.cookie('auth-cookie', resData.refreshToken, this.cookieOptions);
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
  @Patch('resetPassword')
  async resetUserPassword(
    @Res({ passthrough: true }) res: Response,
    @Body()
    resetData: UserResetPasswordDTO,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/resetPassword', resetData),
    );

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true });
    return resData;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get device by id' })
  @ApiResponse({ status: 200, type: GetUserDTO })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  @Get('getDevicesData/:id')
  async getTokensDeviceData(@Param('id', ParseIntPipe) id: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('user/getTokensDeviceData', id),
    );

    return resData;
  }

  @Get('clear')
  async clearDbTestData() {
    if (process.env.NODE_ENV !== 'test') {
      throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
    }

    const resData = await firstValueFrom(
      this.authServiceClient.send('user/deleteLastData', ''),
    );

    return resData;
  }
}
