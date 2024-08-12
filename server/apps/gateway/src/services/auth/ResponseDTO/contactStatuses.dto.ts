import { ApiProperty } from '@nestjs/swagger';

export class ContactStatusesDTO {
  @ApiProperty({
    example: false,
    required: true,
    description: 'isBanned status',
  })
  isBanned: boolean;

  @ApiProperty({
    example: false,
    required: true,
    description: 'isBannedByContact status',
  })
  isBannedByContact: boolean;

  @ApiProperty({
    example: false,
    required: true,
    description: 'isConfirmRequest status',
  })
  isConfirmRequest: boolean;

  @ApiProperty({
    example: false,
    required: true,
    description: 'isFriend status',
  })
  isFriend: boolean;

  @ApiProperty({
    example: false,
    required: true,
    description: 'isPendingRequest status',
  })
  isPendingRequest: boolean;
}
