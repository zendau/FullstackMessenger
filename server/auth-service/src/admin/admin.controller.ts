import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRole } from '../user/user.entity';
import IUserPaginationList from 'src/contacts/interfaces/IUserPaginationList';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @MessagePattern('admin/unblockUser')
  async unblockUser(@Payload() userId: number) {
    const res = await this.adminService.setUnblock(userId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    console.log(res);
    return res;
  }

  @MessagePattern('admin/blockUser')
  async blockUser(@Payload() userId: number) {
    const res = await this.adminService.setBlock(userId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    console.log(res);
    return res;
  }

  @MessagePattern('admin/list')
  async getAllUsers(listData: IUserPaginationList) {
    console.log('listData', listData);
    const res = await this.adminService.getAllUsers(listData).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('admin/setRole')
  async setUserRole(@Payload() roleData: { userId: number; role: UserRole }) {
    const res = await this.adminService
      .setUserRole(roleData.userId, roleData.role)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('admin/rolesList')
  async getRolesList() {
    const res = this.adminService.getRolesList();
    return res;
  }
}
