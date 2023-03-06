import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ConfirmDataDTO {
  @ApiProperty({
    example: 'root@gmail.com',
    description: 'user email',
    required: true,
  })
  @IsEmail()
  email: string;
}
