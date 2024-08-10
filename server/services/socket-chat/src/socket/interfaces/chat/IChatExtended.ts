import IChat from '@/chat/interfaces/IChat';
import { Message } from '@/message/entities/message.entity';

export default interface IChatExtended extends IChat {
  chatUnread: number;
  lastMessage: Message;
  userUnread: number;
}
