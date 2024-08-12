import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorDTO {
  @ApiProperty({
    example: 'false',
    description: 'Boolean status',
    required: true,
  })
  status: boolean;

  @ApiProperty({
    example: 'Not valid property',
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
