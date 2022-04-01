import { IsInt, Min } from 'class-validator';

export class UpdateChatDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  companionId: number;
}
