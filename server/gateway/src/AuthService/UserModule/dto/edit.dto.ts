import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class EditData {
  @ApiProperty({
    example: 'admin',
    description: 'user login',
    required: true,
  })
  @IsOptional()
  @Length(6, 20, {
    message: 'login is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Is not currect string' })
  login: string;

  @ApiProperty({
    example: 'root@gmail.com',
    description: 'User email',
    required: true,
  })
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsOptional()
  @IsEmail({ message: 'Is not email' })
  email: string;

  @ApiProperty({
    example: 'root',
    description: 'user password',
    
  })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Is not currect string' })
  @IsOptional()
  password: string;

  @ApiProperty({
    example: 'root',
    description: 'Confirm password',
    required: true,
  })
  @IsOptional()
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

  @ApiProperty({
    example: '1',
    description: 'User id',
    required: true,
  })
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsEmail({ message: 'Is not email' })
  id: number;

  @ApiProperty({
    example: 'root@gmail.com',
    description: 'new email for edit data',
  })
  @IsOptional()
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsEmail({ message: 'Is not email' })
  newEmail: string;
  
}
