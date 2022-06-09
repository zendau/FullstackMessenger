import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Max, Min } from 'class-validator';

export class RegisterData {
  @ApiProperty({
    example: 'root',
    description: 'Email for register',
    required: true,
  })
  @IsEmail({ message: 'Is not email' })
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'login for auth',
    required: true,
  })
  @Length(6, 20, {
    message: 'login is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Is not currect string' })
  login: string;

  @ApiProperty({
    example: 'rootpass',
    description: 'Password for register',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  password: string;

  @ApiProperty({
    example: 'rootpass',
    description: 'Confirm password for register',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  confirmPassword: string;

  @ApiProperty({
    example: 'b75740fc-9859-45fa-9211-f68d2b20c902',
    description: 'Confirm id for register',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  confirmId: string;

  @ApiProperty({
    example: 'b75740fc-9859-45fa-9211-f68d2b20c902',
    description: 'Confirm id for register',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  confirmCode: string;
}
