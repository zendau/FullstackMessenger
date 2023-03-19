import { ApiProperty } from '@nestjs/swagger';

export class ChatUserDTO {
  @ApiProperty({
    example: 1,
    description: 'User id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 'test@root.com',
    description: 'User email',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'test',
    description: 'User login',
    required: true,
  })
  login: string;

  @ApiProperty({
    example: 'online',
    description: 'User online status',
    required: true,
  })
  lastOnline: Date | string;

  @ApiProperty({
    example: '1123fd',
    description: 'User peer id',
    required: true,
  })
  peerId?: string;
}
