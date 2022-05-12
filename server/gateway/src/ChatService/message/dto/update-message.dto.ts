import { IMessageDTO } from './message.dto';
//import { IsString, Length } from 'class-validator';

export class IUpdateMessageDTO extends IMessageDTO {
  id: number;
}
