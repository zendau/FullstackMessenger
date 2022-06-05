import { ConfirmCodeService } from '../confirm/confirm-status/confirm-status.service';
import { UsersService } from './users.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUser from './interfaces/IUserData';

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
        console.log(err);
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

  @MessagePattern('user/login')
  async loginUser(@Payload() userData: IUser) {
    const res = await this.UsersService.login(userData);
    return res;
  }

  @MessagePattern('user/refresh')
  async refresh(@Payload() refreshToken: string) {
    const res = await this.UsersService.refreshToken(refreshToken);
    return res;
  }

  @MessagePattern('user/activate')
  async activateAccount(
    @Payload() activateData:
      {
        confirmCode: string,
        userId: number
      }) {
        console.log('activate data', activateData);
    const checkCode = await this.confirmCodeService.checkConfirmCode(activateData.confirmCode, activateData.userId);
    
    if (checkCode) {
      await this.confirmCodeService.activateAccount(activateData.userId);
      return true
    }

    return {
      status: false,
      message: 'Confirm code is not valid',
      httpCode: HttpStatus.BAD_REQUEST,
    };
  }


  @MessagePattern('user/activateByAdmin')
  async activateAccountByAdmin(@Payload() userId: number) {
    const res = await this.confirmCodeService.activateAccount(userId);
    return res;
  }

  @MessagePattern('user/changeData')
  async changeUserData(@Payload() userData: IUser) {
    console.log(userData);
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
}
