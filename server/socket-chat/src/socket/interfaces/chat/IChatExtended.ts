import IChat from 'src/chat/interfaces/IChat';
import { Message } from 'src/message/entities/message.entity';

export default interface IChatExtended extends IChat {
  isNotUnread: number;
  lastMessage: Message;
  unread: number;
}
