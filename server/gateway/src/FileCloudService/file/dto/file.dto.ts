import { FoulderDTO } from './../../foulder/dto/foulder.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FileDTO {
  @ApiProperty({
    example: '16',
    description: 'file id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '2022-03-28T11:50:34.168Z',
    description: 'created date',
    required: true,
  })
  created_at: string;

  @ApiProperty({
    example: '2022-03-28T11:50:34.168Z',
    description: 'updated date',
    required: true,
  })
  updated_at: string;

  @ApiProperty({
    example: 'file.jpg',
    description: 'file original name',
    required: true,
  })
  fileName: string;

  @ApiProperty({
    example: '05a2be36-bd4e-4319-95cc-002f3bd1085d.jpg',
    description: 'file temp name',
    required: true,
  })
  fileTempName: string;

  @ApiProperty({
    example: 339148,
    description: 'file size',
    required: true,
  })
  size: number;

  @ApiProperty({
    example: 1,
    description: 'author userId',
    required: true,
  })
  userId: 1;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'file mimetype',
    required: true,
  })
  mimetype: string;

  @ApiProperty({
    example: FoulderDTO,
    description: 'file mimetype',
    required: true,
  })
  foulder: FoulderDTO;
}
