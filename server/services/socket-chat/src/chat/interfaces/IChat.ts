import { Chat } from '@/chat/entities/chat.entity';
import IUser from '@/chat/interfaces/IUser';

export default interface IChat extends Omit<Chat, 'chatUsers'> {
  users: IUser[] | number[];
  conferenceWithVideo: boolean;
}
