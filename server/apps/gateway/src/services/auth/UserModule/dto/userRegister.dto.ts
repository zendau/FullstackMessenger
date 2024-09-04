import { UserLoginDTO } from './userLogin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UserRegisterDTO extends UserLoginDTO {
  @ApiProperty({
    example: 'admin',
    description: 'user login',
    required: true,
  })
  @Length(6, 20, {
    message: 'Login is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Login must be a string' })
  login: string;

  @ApiProperty({
    example: 'b75740fc-9859-45fa-9211-f68d2b20c902',
    description: 'Confirm code to verify account',
    required: true,
  })
  @IsString({ message: 'Confirm code must be a string' })
  confirmCode: string;
}
