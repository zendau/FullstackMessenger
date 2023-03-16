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
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/AuthService/guards/jwt-auth.guard';
import { GetUserDTO } from '@/AuthService/ResponseDTO/getUser.dto';
import { HttpErrorDTO } from '@/AuthService/ResponseDTO/httpError.dto';
import { RoleDTO } from '@/AuthService/UserModule/dto/role.dto';
import IUserPaginationList from '@/AuthService/UserModule/interfaces/IUserPaginationList';
import RoleGuard from '@/AuthService/guards/roles.guard';
import { UserRole } from '@/AuthService/enum/userRole.enum';
import { RoleListDTO } from '@/AuthService/UserModule/dto/roleList.dto';
import HttpClearCacheInterceptor from '@/Cache/clearCache';

@ApiBearerAuth()
@ApiTags('Auth microservice - Admin controller')
@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard(UserRole.ADMIN))
@Controller('admin')
export class AdminController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: 200, type: GetUserDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('list')
  async getAllUsers(@Query() listData: IUserPaginationList) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('admin/list', listData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiBearerAuth()
  @UseInterceptors(HttpClearCacheInterceptor)
  @ApiOperation({ summary: 'set banned status for user by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({
    status: 400,
    description: 'user not found',
    type: HttpErrorDTO,
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get role`s list' })
  @ApiResponse({ status: 200, type: RoleListDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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
