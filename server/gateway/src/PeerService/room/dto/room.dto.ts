import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Length, Min } from 'class-validator';

export class RoomDTO {
  @ApiProperty({
    example: 'title',
    description: 'title for conference room',
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  roomTitle: string;

  @ApiProperty({
    example: 1,
    description: 'conference admin id',
    required: true,
  })
  @IsNumber()
  @Min(1)
  adminId: number;

  @ApiProperty({
    example: 'eabb5df4-a4bd-4ca6-8b24-712209c01052',
    description: 'chatId for integration',
    required: true,
  })
  @IsString()
  @Length(2, 20, {
    message: 'Value is smaller than 2 or bigger than 20 signs',
  })
  chatId: string;

  @ApiProperty({
    example: true,
    description: 'room with video or not',
    required: true,
  })
  @IsBoolean()
  roomWithVideo: boolean;
}
