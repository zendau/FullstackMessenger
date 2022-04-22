import { IsInt, Min } from 'class-validator';

export class userRoleDataDTO {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  roleId: number;
}
