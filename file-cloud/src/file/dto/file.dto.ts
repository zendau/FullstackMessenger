import { IsInt, IsString, Length, Min } from 'class-validator';

export class IFileDTO {
  @IsInt()
  @Min(1)
  id?: number;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  fileName?: string;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  fileTempName?: string;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  path: string;

  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  mimetype?: string;

  @IsInt()
  @Min(1)
  foulderId: number;

  @IsInt()
  @Min(1)
  size?: number;

  @IsInt()
  @Min(1)
  userId: number;
}
