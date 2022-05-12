import { userRoleDataDTO } from './dto/userRole.dto';
import { editRoleDataDTO } from './dto/editRoleData.dto';
import { roleDataDTO } from './dto/roleData.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorDTO } from 'src/AuthService/dto/httpError.dto';
@ApiTags('Auth microservice - Role controller')
@Controller('role')
export class RoleController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  // role/add

  @ApiOperation({ summary: 'Register new role' })
  @ApiResponse({ status: 200, type: editRoleDataDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Post('add')
  async addNewRole(@Body() roleData: roleDataDTO) {
    console.log(roleData);
    const res = await firstValueFrom(
      this.authServiceClient.send('role/add', roleData),
    );
    console.log(res);
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/edit

  @ApiOperation({ summary: 'Edit role' })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  //@UsePipes(ValidationPipe)
  @Put('edit')
  async editRole(@Body() roleData: editRoleDataDTO) {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/edit', roleData),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/get

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: editRoleDataDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('get')
  async getRoles() {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/get', ''),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/delete

  @ApiOperation({ summary: 'Get all roles' })
  @ApiParam({
    name: 'roleId',
    type: Number,
  })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('delete/:roleId')
  async deleteRole(@Param() params) {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/delete', params.roleId),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/setUserRole

  @ApiOperation({ summary: 'Set role to user' })
  @ApiResponse({ status: 200, type: userRoleDataDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Post('setUserRole')
  async addUserRole(@Body() userRoleData: userRoleDataDTO) {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/setUserRole', userRoleData),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/editUserRole

  @ApiOperation({ summary: 'Edit user role' })
  @ApiResponse({ status: 200, type: userRoleDataDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Put('editUserRole')
  async editUserRole(@Body() userRoleData: userRoleDataDTO) {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/editUserRole', userRoleData),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  // role/getUsersRole

  @ApiOperation({ summary: 'Get all users role' })
  @ApiParam({
    name: 'roleId',
    type: Number,
  })
  @ApiResponse({ status: 200, type: editRoleDataDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getUsersRole/:roleId')
  async getUsersRole(@Param() param) {
    const res = await firstValueFrom(
      this.authServiceClient.send('role/getUsersRole', param.roleId),
    );

    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
