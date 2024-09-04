import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumber, IsString, Min } from 'class-validator';

export class ChatDTO {
  @ApiProperty({
    example: '08a81cf0-6229-47b3-a85b-25501f2651c5',
    description: 'Chat id',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'test title',
    description: 'Title if chat is group',
    required: false,
  })
  @IsString({ always: false })
  title: string | null;

  @ApiProperty({
    example: 1,
    description: 'AdminId',
    required: true,
  })
  @IsNumber()
  @Min(1)
  adminId: number;

  @ApiProperty({
    example: [2],
    description: 'Chat users id',
    required: true,
  })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  users: number[];


  @ApiProperty({
    example: 1,
    description: 'Chat unread messages count',
    required: true,
  })
  @IsNumber()
  @Min(0)
  chatUnread: number;

  @ApiProperty({
    example: 'Hello',
    description: 'Message of chat',
    required: true,
  })
  @IsString()
  lastMessage: string;

  @ApiProperty({
    example: 1,
    description: 'User unread messages count',
    required: true,
  })
  @IsNumber()
  @Min(0)
  userUnread: number;
}
