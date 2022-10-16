import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserResetPasswordDTO {
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
    example: 'b75740fc-9859-45fa-9211-f68d2b20c902',
    description: 'Confirm code to verify account',
    required: true,
  })
  @IsString({ message: 'Is not currect string' })
  confirmCode: string;
}
