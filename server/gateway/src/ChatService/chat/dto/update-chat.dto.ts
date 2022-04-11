import { IsInt, Min } from 'class-validator';

export class UpdateChatDto {
  roomId: string;

  usersId: number[];
}
