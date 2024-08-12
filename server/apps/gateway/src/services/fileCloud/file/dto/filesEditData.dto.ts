import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumber, IsString, Length } from 'class-validator';

export class FileEditDataDTO {
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
    example: [1],
    description: "files id to update",
    required: true,
  })
  @IsNumber({},{each: true})
  @ArrayMinSize(1)
  filesId: number[];
}
