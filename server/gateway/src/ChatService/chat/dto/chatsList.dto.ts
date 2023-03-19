import { ApiProperty } from '@nestjs/swagger';
import { ChatDTO } from './chat.dto';

export class ChatsListDTO {

  @ApiProperty({
    example: ChatDTO,
    description: 'Title if chat is group',
    required: true,
  })
  currentTempChatData: ChatDTO;

  @ApiProperty({
    example: ChatDTO,
    description: 'Json stringify array of chatDTO',
    required: true,
  })
  roomsData: [ChatDTO];

  @ApiProperty({
    example: true,
    description: 'Pagination has more chats',
    required: true,
  })
  hasMore: boolean;

  @ApiProperty({
    example: 1,
    description: 'Pagination page',
    required: true,
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Pagination limit',
    required: true,
  })
  limit: number;

  @ApiProperty({
    example:  false,
    description: 'Chat cached status',
    required: true,
  })
  inMemory: boolean;
}
