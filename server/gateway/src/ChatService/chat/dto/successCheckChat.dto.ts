import { ApiProperty } from '@nestjs/swagger';

export class SuccessCheckChatDTO {
  @ApiProperty({
    example: true,
    description: 'Check boolean status',
    required: true,
  })
  status: boolean;


  @ApiProperty({
    example: '08a81cf0-6229-47b3-a85b-25501f2651c5',
    description: 'Chat id',
    required: true,
  })
  chatId: string;
}
