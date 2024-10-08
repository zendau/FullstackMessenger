import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { MessageDTO } from './message.dto';

export class UpdateMessageDTO extends MessageDTO {
  @ApiProperty({
    example: 1,
    description: "message id",
    required: true,
  })
  @IsNumber()
  @Min(1)
  id: number;
}
