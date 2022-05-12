//import { ValidationPipe } from '../../pipes/validation.pipe';
import { RegisterData } from './dto/register.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
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

@ApiTags('Auth microservice - User controller')
@Controller('user')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

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

    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true });
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
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: true });
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

    res.cookie('auth-cookie', resData.refreshToken, { httpOnly: false });
    return resData;
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
}
