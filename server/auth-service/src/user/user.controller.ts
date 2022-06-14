import { TokenService } from './../token/token.service';
import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { UserService } from './user.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUser from './interfaces/IUserData';
import IConfirmData from './interfaces/IConfirmData';
import IEditUser from './interfaces/IEditUserData';

@Controller()
export class UsersController {
  constructor(
    private userService: UserService,
    private confirmCodeService: ConfirmCodeService,
    private tokenService: TokenService,
  ) { }

  @MessagePattern('user/register')
  async registerUser(@Payload() userData: IUser) {
    const res = await this.userService.register(userData).catch(
      (err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    return res;
  }

  @MessagePattern('user/login')
  async loginUser(@Payload() userData: IUser) {
    const res = await this.userService.login(userData).catch(
      (err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    return res;
  }

  @MessagePattern('user/refresh')
  async refresh(@Payload() refreshToken: string) {
    const res = await this.userService.refreshToken(refreshToken);
    return res;
  }



  @MessagePattern('user/logout')
  async logout(@Payload() refreshToken: string) {
    const res = await this.tokenService.removeToken(refreshToken).catch(
      (err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    console.log(res);
    return res;
  }



  @MessagePattern('user/unBlockUser')
  async unBlockUser(@Payload() userId: number) {
    const res = await this.confirmCodeService.setUnBlock(userId).catch(
      (err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    console.log(res);
    return res;
  }

  @MessagePattern('user/blockUser')
  async blockUser(@Payload() userId: number) {
    const res = await this.confirmCodeService.setBlock(userId).catch(
      (err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
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
    const res = await this.userService.editUserData(editData).catch(
      (err) => {
        console.log('err', err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    return res;
  }

  @MessagePattern('user/resetPassword')
  async resetUserPassword(@Payload() resetData: IUser) {
    const res = await this.userService.resetUserPassword(resetData).catch(
      (err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      },
    );
    return res;
  }


  @MessagePattern('user/all')
  async getAllUsers() {
    const res = await this.userService.getAllUsers();
    return res;
  }

  @MessagePattern('user/id')
  async getUserById(@Payload() id: number) {
    debugger;
    console.log(id);
    const res = await this.userService.getUserById(id);
    console.log(id, res);
    return res;
  }

  @MessagePattern('user/test')
  async test() {
    const res = await this.userService.confirmEmail();
    return res;
  }
}
