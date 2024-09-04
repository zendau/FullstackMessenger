import IChatExtended from '../chat/IChatExtended';

export default interface IReadMessage {
  userId: string;
  chatData: IChatExtended;
  count: number;
}
