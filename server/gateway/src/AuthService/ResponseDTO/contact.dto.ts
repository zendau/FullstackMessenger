import { ApiProperty } from '@nestjs/swagger';
import IContact from '../UserModule/interfaces/IContact';

export class ContactDTO implements IContact {

  @ApiProperty({
    example: 1,
    description: 'User id',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 2,
    description: 'Contact id',
    required: true
  })
  contactId: number;
}
