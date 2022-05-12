import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Length, Min } from 'class-validator';

export class editRoleDataDTO {
  @ApiProperty({
    example: '1',
    description: 'Role ID',
    required: true,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    example: 'Admin',
    description: 'Name for role',
    required: true,
  })
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  value: string;

  @ApiProperty({
    example: 'Role admin',
    description: 'description for role',
    required: true,
  })
  @Length(2, 200, {
    message: 'Value is smaller than 2 or bigger than 200 signs',
  })
  desc: string;
}
