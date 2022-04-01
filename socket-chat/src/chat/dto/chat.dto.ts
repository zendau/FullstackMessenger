import { IsInt, Min } from 'class-validator';

export class ChatDTO {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  companionId: number;
}
