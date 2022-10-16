import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ContactDTO {

  @ApiProperty({
    example: 1,
    description: 'User id',
    required: true,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 2,
    description: 'Contact id',
    required: true
  })
  contactId: number;
}
