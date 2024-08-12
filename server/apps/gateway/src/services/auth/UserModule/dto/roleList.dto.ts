import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { UserRole } from '@/services/auth/enum/userRole.enum';

export class RoleListDTO {
  @ApiProperty({
    example: 'USER',
    description: 'User`s roles',
    required: true,
  })
  @IsArray()
  role: UserRole;
}
