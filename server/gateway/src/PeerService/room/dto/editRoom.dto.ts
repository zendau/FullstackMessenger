import { roomDTO } from './room.dto';
import { IsInt, Min } from 'class-validator';

export class editRoomDTO extends roomDTO {
  @IsInt()
  @Min(1)
  id: number;
}
