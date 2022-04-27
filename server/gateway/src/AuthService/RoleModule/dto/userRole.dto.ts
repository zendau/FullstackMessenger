import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class userRoleDataDTO {
  @ApiProperty({
    example: '1',
    description: 'User ID',
    required: true,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    example: '1',
    description: 'Role ID',
    required: true,
  })
  @IsInt()
  @Min(1)
  roleId: number;
}
