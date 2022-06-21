import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumber } from 'class-validator';

export class UsersIdDTO {
  @ApiProperty({
    example: [2],
    description: 'Chat users id',
    required: true,
  })
  @IsNumber({},{each: true})
  @ArrayMinSize(1)
  users: number[];
}
