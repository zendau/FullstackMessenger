import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { IMessageDTO } from './message.dto';
//import { IsString, Length } from 'class-validator';

export class IUpdateMessageDTO extends IMessageDTO {
  @ApiProperty({
    example: 1,
    description: "message id",
    required: true,
  })
  @IsNumber()
  @Min(1)
  id: number;
}
