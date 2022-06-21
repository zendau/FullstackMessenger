import { LoginDTO } from './login.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RegisterDTO extends LoginDTO {
  @ApiProperty({
    example: 'admin',
    description: 'user login',
    required: true,
  })
  @Length(6, 20, {
    message: 'login is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Is not currect string' })
  login: string;

  @ApiProperty({
    example: 'root',
    description: 'Confirm password',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  confirmPassword: string;

  @ApiProperty({
    example: 'b75740fc-9859-45fa-9211-f68d2b20c902',
    description: 'Confirm code to verify account',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  confirmCode: string;
}
