import { IsInt, Min } from 'class-validator';

export class UpdateChatDTO {
  roomId: string;

  usersId: number[];
}
