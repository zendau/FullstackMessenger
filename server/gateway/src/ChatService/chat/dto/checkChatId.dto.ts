import { ChatDTO } from './chat.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CheckChatIdDTO extends ChatDTO {
  @ApiProperty({
    example: 1,
    description: 'chat id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '08a81cf0-6229-47b3-a85b-25501f2651c5',
    description: 'chatId',
    required: true,
  })
  сhatId: string;
}
