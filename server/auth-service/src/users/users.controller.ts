import { UsersService } from './users.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUser from './interfaces/IUserData';

@Controller()
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @MessagePattern('user/register')
  async registerUser(@Payload() userData: IUser) {
    const res = await this.UsersService.register(userData, true).catch(
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
}
