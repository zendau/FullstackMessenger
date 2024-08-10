import { ApiProperty } from '@nestjs/swagger';

export class GetUserDTO {
  @ApiProperty({
    example: 1,
    description: 'User id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 'root@gmail.com',
    description: 'User email',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'root',
    description: 'User login',
    required: true
  })
  login: string;
}
