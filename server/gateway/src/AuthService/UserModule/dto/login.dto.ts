import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'root@gmail.com',
    description: 'User email',
    required: true,
  })
  @Length(6, 20, {
    message: 'Email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsEmail({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({
    example: 'root',
    description: 'user password',
    
  })
  @Length(6, 20, {
    message: 'Password is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
