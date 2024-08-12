import { IsInt, IsString, Length, Min } from 'class-validator';

export class filesUploadDataDTO {
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  path: string;

  @IsInt()
  @Min(1)
  userId: number;
}
