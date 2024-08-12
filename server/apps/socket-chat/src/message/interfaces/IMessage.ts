export interface IMessage {
  id: string;
  chatId: string;
  authorLogin: string;
  authorId: number;
  text: string;
  isEdited: boolean;
  created_at: Date;
}
