import IUser from 'src/chat/interfaces/IUser';
import IFile from './IFile';

export default interface IMessageData {
  roomId: string;
  authorId: number;
  authorLogin: string;
  text: string;
  files?: IFile[];
  users: IUser[];
}
