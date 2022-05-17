import { IsInt, Min } from 'class-validator';

export class UpdateChatDto {
  roomId: string;

  userId: number;
}
