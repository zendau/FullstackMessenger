import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class UserChatUpdateStatusDto {
  @ApiProperty({
    example: "98f7824a-e958-4b56-965c-60af7a7d8a0c",
    description: 'Chat id',
    required: true,
  })
  @IsNumber()
  @Min(1)
  chatId: number;

  @ApiProperty({
    example: 2,
    description: 'User id',
    required: true,
  })
  @IsNumber()
  @Min(1)
  userId: number;
}
