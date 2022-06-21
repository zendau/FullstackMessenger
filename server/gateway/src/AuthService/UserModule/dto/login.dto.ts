import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'root@gmail.com',
    description: 'User email',
    required: true,
  })
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
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
  password: string;
}
