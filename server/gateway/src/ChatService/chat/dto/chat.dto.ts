import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';
import { CheckChatDTO } from './checkChat.dto';

export class ChatDTO extends CheckChatDTO {

  @ApiProperty({
    example: 'test title',
    description: 'Title if chat is group',
    required: false,
  })
  @IsString({always: false})
  groupName: string | null;
}
