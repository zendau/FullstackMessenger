import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ConfirmDataDTO {
  @ApiProperty({
    example: 'root@gmail.com',
    description: 'user email',
    required: true,
  })
  @Min(1)
  @IsNumber()
  email: string;
}
