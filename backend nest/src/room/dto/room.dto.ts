import { IsInt, IsString, Length, Min } from 'class-validator';

export class IRoomDTO {
  @IsInt()
  @Min(1)
  roomId: number;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  roomTitle: string;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  adminLogin: string;
}
