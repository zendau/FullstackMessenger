import { UsersIdDTO } from './usersId.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CheckChatDTO extends UsersIdDTO {
  @ApiProperty({
    example: 1,
    description: 'AdminId',
    required: true,
  })
  @IsNumber()
  @Min(1)
  adminId: number;
}
