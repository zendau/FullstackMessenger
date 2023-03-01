import { AuthService } from './auth.service';
import { TokenService } from './../token/token.service';
import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { UserService } from './user.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUser from './interfaces/IUserData';
import IConfirmData from './interfaces/IConfirmData';
import IEditUser from './interfaces/IEditUserData';
import IRefreshData from './interfaces/IRefreshData';
import { UserRole } from './user.entity';
import { DeviceService } from 'src/token/device.service';

@Controller()
export class UsersController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private confirmCodeService: ConfirmCodeService,
    private tokenService: TokenService,
    private deviceService: DeviceService,
  ) {}

  @MessagePattern('user/register')
  async registerUser(@Payload() userData: IUser) {
    console.log(userData);
    const res = await this.authService.register(userData).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/login')
  async loginUser(@Payload() userData: IUser) {
    const res = await this.authService.login(userData).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
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
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
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
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    console.log(res);
    return res;
  }


  @MessagePattern('user/setConfirmCode')
  async getCodeEditData(@Payload() confirmData: IConfirmData) {
    const res = await this.confirmCodeService.setConfirmCode(confirmData);
    return res;
  }

  @MessagePattern('user/editData')
  async changeUserData(@Payload() editData: IEditUser) {
    console.log('edit data', editData);
    const res = await this.userService.editUserData(editData).catch((err) => {
      console.log('err', err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('user/resetPassword')
  async resetUserPassword(@Payload() resetData: IUser) {
    const res = await this.authService
      .resetUserPassword(resetData)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }



  @MessagePattern('user/idList')
  async getManyUserById(@Payload() idList: number[]) {
    const res = await this.userService.getManyUserById(idList).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    console.log('res 1', res);
    return res;
  }

  @MessagePattern('user/id')
  async getUserById(@Payload() id: number) {
    console.log('1', id);
    const res = await this.userService.getUserById(id).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
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
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }
  @MessagePattern('user/getTokensDeviceData')
  async getTokensDeviceData(@Payload() userId: number) {
    console.log('userId', userId);
    const res = await this.deviceService
      .getTokensDeviceData(userId)
      .catch((err) => {
        console.log('err', err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

}
