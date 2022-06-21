import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class filesUploadDataDTO {
  @ApiProperty({
    example: '86efdadb-22a8-42ff-aef3-c9235c07962d',
    description: "file's path",
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  path: string;

  @ApiProperty({
    example: 1,
    description: "file's author user id ",
    required: true,
  })
  @IsInt()
  @Min(1)
  userId: number;
}
