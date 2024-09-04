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

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUserDTO } from '@/services/auth/ResponseDTO/getUser.dto';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';
import { RoleDTO } from '@/services/auth/UserModule/dto/role.dto';
import IUserPaginationList from '@/services/auth/UserModule/interfaces/IUserPaginationList';
import RoleGuard from '@/common/guards/roles.guard';
import { UserRole } from '@/services/auth/enum/userRole.enum';
import { RoleListDTO } from '@/services/auth/UserModule/dto/roleList.dto';
import HttpClearCacheInterceptor from '@/cache/clearCache';

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

    return resData;
  }
}
