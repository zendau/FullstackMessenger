import IFile from './IFile';

export default interface IEditMessage {
  roomId: string;
  messageId: string;
  updatedText: string;
  deletedFiles?: number[];
  files?: IFile[];
}
