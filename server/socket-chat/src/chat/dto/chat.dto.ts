import { IsInt, Min } from 'class-validator';

export class ChatDTO {
  @IsInt()
  @Min(1)
  adminId: number;

  users: number[];
  groupName?: string;
}
