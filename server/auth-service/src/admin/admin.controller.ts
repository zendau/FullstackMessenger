import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserRole } from '@/user/user.entity';
import IUserPaginationList from '@/contacts/interfaces/IUserPaginationList';
import { AdminService } from '@/admin/admin.service';

@Controller()
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private adminService: AdminService) {}

  @MessagePattern('admin/unblockUser')
  async unblockUser(@Payload() userId: number) {
    const res = await this.adminService.setUnblock(userId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('admin/blockUser')
  async blockUser(@Payload() userId: number) {
    const res = await this.adminService.setBlock(userId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('admin/list')
  async getAllUsers(listData: IUserPaginationList) {
    const res = await this.adminService.getAllUsers(listData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
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
        this.logger.error(err.sqlMessage);
        return {
          status: false,
          message: 'error.unexpected',
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
