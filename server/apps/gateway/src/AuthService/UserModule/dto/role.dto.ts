import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { UserRole } from '@/AuthService/enum/userRole.enum';

export class RoleDTO {
  @ApiProperty({
    example: 'root@gmail.com',
    description: 'User email',
    required: true,
  })
  @Min(1)
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'USER',
    description: 'User role',
    required: true,
  })
  @IsString()
  role: UserRole;
}
