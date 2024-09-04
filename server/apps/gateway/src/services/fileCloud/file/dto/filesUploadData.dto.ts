import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FilesUploadDataDTO {
  @ApiProperty({
    example: '86efdadb-22a8-42ff-aef3-c9235c07962d',
    description: "file's path",
    required: true,
  })
  @IsUUID('4', { each: true })
  path: string;

  @ApiProperty({
    example: 1,
    description: "file's author user id ",
    required: true,
  })
  @IsUUID('4', { each: true })
  userId: number;
}
