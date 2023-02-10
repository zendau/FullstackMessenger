import { Chat } from '../entities/chat.entity';
import IUser from './IUser';

export interface IUserData {
  [key: string]: IUser;
}

export default interface IChat extends Omit<Chat, 'chatUsers'> {
  users: IUserData;
  conferenceWithVideo: boolean;
}
