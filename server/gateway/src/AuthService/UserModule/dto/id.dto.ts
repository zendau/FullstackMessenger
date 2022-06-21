import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UserIdDTO {
  @ApiProperty({
    example: '1',
    description: 'User id',
    required: true,
  })
  @Min(1)
  @IsNumber()
  id: number;
}
