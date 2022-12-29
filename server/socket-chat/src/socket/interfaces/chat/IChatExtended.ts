import IChat from 'src/chat/interfaces/IChat';
import { Message } from 'src/message/entities/message.entity';

export default interface IChatExtended extends IChat {
  chatUnread: number;
  lastMessage: Message;
  userUnread: number;
}
