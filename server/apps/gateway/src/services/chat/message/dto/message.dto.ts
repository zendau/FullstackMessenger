import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, MinLength } from "class-validator";

export class MessageDTO {
  @ApiProperty({
    example: '86efdadb-22a8-42ff-aef3-c9235c07962d',
    description: "chatId in which the message was sent",
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  chatId: string;

  @ApiProperty({
    example: 'admin',
    description: "message author",
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  authorLogin: string;


  @ApiProperty({
    example: '86efdadb-22a8-42ff-aef3-c9235c07962d',
    description: "message content",
    required: true,
  })
  @IsString()
  @MinLength(1)
  text: string;
}
