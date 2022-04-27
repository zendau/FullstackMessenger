import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class roleDataDTO {
  @ApiProperty({
    example: 'Admin',
    description: 'Name for role',
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  value: string;

  @ApiProperty({
    example: 'Role admin',
    description: 'description for role',
    required: true,
  })
  @IsString()
  @Length(2, 200, {
    message: 'Value is smaller than 2 or bigger than 200 signs',
  })
  desc: string;

  @IsInt()
  @Min(1)
  accessLevel: number;
}
