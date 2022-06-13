import { NodeMailerService } from '../access/nodemailer/nodemailer.service';
import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { UsersService } from './user.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUser from './interfaces/IUserData';
import IConfirmData from './interfaces/IConfirmData';
import IEditUser from './interfaces/IEditUserData';

@Controller()
export class UsersController {
  constructor(
    private UsersService: UsersService,
    private confirmCodeService: ConfirmCodeService
  ) { }

  @MessagePattern('user/register')
  async registerUser(@Payload() userData: IUser) {
    const res = await this.UsersService.register(userData).catch(
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
    const res = await this.UsersService.login(userData).catch(
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
    const res = await this.UsersService.refreshToken(refreshToken);
    return res;
  }




  // @MessagePattern('user/activateByAdmin')
  // async activateAccountByAdmin(@Payload() userId: number) {
  //   const res = await this.confirmCodeService.activateAccount(userId);
  //   return res;
  // }

  @MessagePattern('user/setConfirmCode')
  async getCodeEditData(@Payload() confirmData: IConfirmData) {
    const res = await this.confirmCodeService.setConfirmCode(confirmData);
    return res;
  }

  @MessagePattern('user/editData')
  async changeUserData(@Payload() editData: IEditUser) {
    console.log('edit data', editData);
    const res = await this.UsersService.editUserData(editData).catch(
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
    const res = await this.UsersService.resetUserPassword(resetData).catch(
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
    const res = await this.UsersService.getAllUsers();
    return res;
  }

  @MessagePattern('user/id')
  async getUserById(@Payload() id: number) {
    debugger;
    console.log(id);
    const res = await this.UsersService.getUserById(id);
    console.log(id, res);
    return res;
  }

  @MessagePattern('user/test')
  async test() {
    const res = await this.UsersService.confirmEmail();
    return res;
  }
}
