import IUser from 'src/chat/interfaces/IUser';
import IFile from './IFile';

export default interface IMessageData {
  roomId: string;
  authorId: number;
  authorLogin: string;
  text: string;
  type?: 'date' | 'add' | 'remove' | 'exit' | 'created';
  files?: IFile[];
  users: IUser[];
}
