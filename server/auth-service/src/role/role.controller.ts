import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRole } from './userRole.entity';
import IEditUserData from './interfaces/IEditUserData';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @MessagePattern('role/add')
  async addNewRole(@Payload() roleData: Role) {
    console.log(roleData);
    const res = await this.roleService.addNewRole(roleData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('role/edit')
  async editRole(@Payload() roleData: IEditUserData) {
    const res = await this.roleService.updateRole(roleData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('role/get')
  async getRoles() {
    const res = await this.roleService.getRoles().catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('role/delete')
  async deleteRole(@Payload() roleId: number) {
    const res = await this.roleService.deleteRole(roleId).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('role/setUserRole')
  async addUserRole(@Payload() userRoleData?: UserRole) {
    const res = await this.roleService
      .addUserRole(userRoleData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });

    if (res === undefined) return true;
    return res;
  }

  @MessagePattern('role/editUserRole')
  async editUserRole(@Payload() userRoleData: UserRole) {
    const res = await this.roleService
      .editUserRole(userRoleData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });

    if (res === undefined) return true;
    return res;
  }

  @MessagePattern('role/getUsersRole')
  async getUserRoles(@Payload() roleId: number) {
    const res = await this.roleService.getUsersRole(roleId).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });

    if (res === undefined) return true;
    return res;
  }
}
