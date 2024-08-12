import { Controller, HttpStatus, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from '@/user/auth.service';
import { TokenService } from '@/token/token.service';
import { ConfirmCodeService } from '@/access/access-confirm/access-confirm';
import { UserService } from '@/user/user.service';
import IUserData from '@/user/interfaces/IUserData';
import IConfirmData from '@/user/interfaces/IConfirmData';
import IRefreshData from '@/user/interfaces/IRefreshData';
import { DeviceService } from '@/token/device.service';
import IEditUserData from './interfaces/IEditUserData';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(DetailedRpcExceptionsFilter)
@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private confirmCodeService: ConfirmCodeService,
    private tokenService: TokenService,
    private deviceService: DeviceService,
  ) {}

  @MessagePattern('user/register')
  async registerUser(@Payload() userData: IUserData) {
    const res = await this.authService.register(userData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/checkEmail')
  async checkUserEmail(@Payload() email: string) {
    const res = await this.authService.checkEmail(email);
    return res;
  }

  @MessagePattern('user/login')
  async loginUser(@Payload() userData: IUserData) {
    const res = await this.authService.login(userData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/refresh')
  async refresh(@Payload() refreshData: IRefreshData) {
    const res = await this.authService
      .refreshToken(refreshData)
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

  @MessagePattern('user/logout')
  async logout(@Payload() refreshToken: string) {
    const res = await this.tokenService
      .removeToken(refreshToken)
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

  @MessagePattern('user/setConfirmCode')
  async getCodeEditData(@Payload() confirmData: IConfirmData) {
    const res = await this.confirmCodeService.setConfirmCode(confirmData);
    return res;
  }

  @MessagePattern('user/editData')
  async changeUserData(@Payload() editData: IEditUserData) {
    const res = await this.userService.editUserData(editData).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/resetPassword')
  async resetUserPassword(@Payload() resetData: IUserData) {
    const res = await this.authService
      .resetUserPassword(resetData)
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

  @MessagePattern('user/idList')
  async getManyUserById(@Payload() idList: number[]) {
    const res = await this.userService.getManyUserById(idList).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/id')
  async getUserById(@Payload() id: number) {
    const res = await this.userService.getUserById(id).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/updateLastOnline')
  async updateUserLastOnline(
    @Payload() roleData: { userId: number; lastOnline: Date },
  ) {
    const res = await this.userService
      .setLastOnline(roleData.userId, roleData.lastOnline)
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
  @MessagePattern('user/getTokensDeviceData')
  async getTokensDeviceData(@Payload() userId: number) {
    const res = await this.deviceService
      .getTokensDeviceData(userId)
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
}
