import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class HttpErrorDTO {
  @ApiProperty({
    example: 'false',
    description: 'Boolean status',
    required: true,
  })
  status: boolean;

  @ApiProperty({
    example: 'Value is smaller than 2 or bigger than 20 signs',
    description: 'Message about error',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: '400',
    description: 'Exception code',
  })
  httpCode: number;
}
