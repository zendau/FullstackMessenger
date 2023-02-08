import { GetUserDTO } from '../ResponseDTO/getUser.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '../ResponseDTO/httpError.dto';

import HttpClearCacheInterceptor from '../../Cache/clearCache';

import { RoleDTO } from './dto/role.dto';
import IUserPaginationList from './interfaces/IUserPaginationList';

@ApiTags('Auth microservice - Admin controller')
@Controller('admin')
export class AdminController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UseGuards(JwtRefreshGuard)
  @Get('list')
  async getAllUsers(@Query() listData: IUserPaginationList) {
    console.log('listData', listData);
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/list', listData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpClearCacheInterceptor)
  @ApiOperation({ summary: 'set banned status for user by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  //@UseGuards(RoleGuard(UserRole.Admin))
  //@UseGuards(JwtRefreshGuard)
  @Patch('blockUser/:id')
  async blockUser(@Param('id', ParseIntPipe) userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/blockUser', userId),
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
  //@UseGuards(RoleGuard(UserRole.Admin))
  //@UseGuards(JwtRefreshGuard)
  @Patch('unblockUser/:id')
  async unBlockUser(@Param('id', ParseIntPipe) userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/unblockUser', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Set user role' })
  @ApiResponse({
    status: 200,
    description: 'success setting user role',
  })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtRefreshGuard)
  @UsePipes(ValidationPipe)
  @Patch('setRole')
  async setUserRole(
    @Body()
    roleData: RoleDTO,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/setRole', roleData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
  @Get('rolesList')
  async getRolesList() {
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/rolesList', ''),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
