import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserRole } from '@/user/user.entity';
import IUserPaginationList from '@/contacts/interfaces/IUserPaginationList';
import { AdminService } from '@/admin/admin.service';

import { DetailedRpcExceptionsFilter } from '@lib/exception';
@UseFilters(new DetailedRpcExceptionsFilter())
@Controller()
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private adminService: AdminService) {}

  @MessagePattern('admin/unblockUser')
  async unblockUser(@Payload() userId: number) {
    const res = await this.adminService.setUnblock(userId);
    return res;
  }

  @MessagePattern('admin/blockUser')
  async blockUser(@Payload() userId: number) {
    const res = await this.adminService.setBlock(userId);
    return res;
  }

  @MessagePattern('admin/list')
  async getAllUsers(listData: IUserPaginationList) {
    const res = await this.adminService.getAllUsers(listData);
    return res;
  }

  @MessagePattern('admin/setRole')
  async setUserRole(@Payload() roleData: { userId: number; role: UserRole }) {
    const res = await this.adminService.setUserRole(
      roleData.userId,
      roleData.role,
    );
    return res;
  }

  @MessagePattern('admin/rolesList')
  async getRolesList() {
    const res = this.adminService.getRolesList();
    return res;
  }
}
