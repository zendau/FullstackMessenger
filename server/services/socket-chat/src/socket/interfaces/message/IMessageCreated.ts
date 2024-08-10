import IMessageData from './IMessageData';

export default interface IMessageCreated extends IMessageData {
  created_at: Date;
  id: number;
  isEdited: boolean;
}
