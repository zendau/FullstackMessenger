import { IUserData } from 'src/chat/interfaces/IChat';
import IFile from './IFile';

export default interface IMessageData {
  roomId: string;
  authorId: number;
  authorLogin: string;
  text: string;
  type?: 'date' | 'add' | 'remove' | 'exit' | 'created' | 'text';
  files?: IFile[];
  users: IUserData;
}
