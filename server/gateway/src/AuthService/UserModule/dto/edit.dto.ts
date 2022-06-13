import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class EditData {
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
  @Length(6, 20, {
    message: 'email is smaller than 6 signs or bigger than 20 signs',
  })
  @IsEmail({ message: 'Is not email' })
  newEmail: string;
  
}
