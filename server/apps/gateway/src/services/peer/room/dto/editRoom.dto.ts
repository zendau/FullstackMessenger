import { RoomDTO } from '@/services/peer/room/dto/room.dto';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoomDTO extends RoomDTO {
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  @ApiProperty({
    example: '7132abc5-2a85-4d1c-ad08-7e1863401283',
    description: 'roomId for url',
    required: true,
  })
  roomId: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'created room id',
    required: true,
  })
  id: number;
}
