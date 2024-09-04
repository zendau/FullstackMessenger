import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumber, IsString } from 'class-validator';

export class UpdateChatDTO {
  @ApiProperty({
    example: '08a81cf0-6229-47b3-a85b-25501f2651c5',
    description: 'Chat id',
    required: true,
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    example: [2],
    description: 'Chat users id',
    required: true,
  })
  @IsNumber({},{each: true})
  @ArrayMinSize(1)
  usersId: number[];
}
