export default interface IMessageData {
  chatId: string;
  authorLogin: string;
  text: string;
  files?: number[];
}
