import { IsString, Length } from 'class-validator';

export class roomDTO {
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  roomTitle: string;

  adminId: number;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  chatId: string;

  roomWithVideo: boolean;
}
