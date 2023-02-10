import { Chat } from '../entities/chat.entity';
import IUser from './IUser';

export default interface IChat extends Omit<Chat, 'chatUsers'> {
  users: IUser[];
  conferenceWithVideo: boolean;
}
