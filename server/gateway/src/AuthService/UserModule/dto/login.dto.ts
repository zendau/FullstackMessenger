import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginData {
  @ApiProperty({
    example: 'root',
    description: 'Email for auth',
    required: true,
  })
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsEmail({ message: 'Is not email' })
  email: string;

  @ApiProperty({
    example: 'rootpass',
    description: 'Password for auth',
    
  })
  @Length(6, 20, {
    message: 'password is smaller than 6 signs or bigger than 20 signs',
  })
  @IsString({ message: 'Is not currect string' })
  @IsOptional()
  password: string;
}
