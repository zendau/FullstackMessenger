import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUserChat from '@/socket/interfaces/user/IUserChat';
import { ChatService } from '@/chat/chat.service';
import IGetContactList from '@/chat/interfaces/IGetContactList';
import { SocketService } from '@/socket/socket.service';
import IChatPagination from '@/socket/interfaces/chat/IChatPagination';
import IChatSearch from '@/socket/interfaces/chat/IChatSearch';
import IChatLoad from '@/socket/interfaces/user/IChatLoad';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly socketService: SocketService,
  ) {}

  @MessagePattern('chat/contacts')
  async getUserContacts(@Payload() listData: IGetContactList) {
    const res = await this.chatService.getContactList(listData);
    return res;
  }

  @MessagePattern('chat/checkPrivate')
  async checkPrivateChat(
    @Payload() privateData: { userId: number; contactId: number },
  ) {
    const res = await this.chatService.checkPrivateChat(
      privateData.userId,
      privateData.contactId,
    );

    return res;
  }

  @MessagePattern('chat/usersPrivateChats')
  async getUsersPrivateChats(
    @Payload() privateData: { userId: number; userIdList: number[] },
  ) {
    const res = await this.chatService.getUsersPrivateChats(
      privateData.userId,
      privateData.userIdList,
    );

    return res;
  }

  @MessagePattern('chat/listPagination')
  async getChatsPagination(@Payload() paginationData: IChatPagination) {
    const userRoomsData = await this.chatService.getChatPagination(
      paginationData,
    );

    return userRoomsData;
  }

  @MessagePattern('chat/serch')
  async getChatsByPattern(@Payload() searchData: IChatSearch) {
    const userRoomsData = await this.chatService.getChatsByPattern(
      searchData.userId,
      searchData.pattern,
    );

    return userRoomsData;
  }

  @MessagePattern('chat/byId')
  async loadChatById(@Payload() loadData: IChatLoad) {
    const userRoomsData = await this.socketService.getCurrentChatById(
      loadData.userId,
      loadData.chatId,
    );

    return userRoomsData;
  }

  @MessagePattern('chat/freeUsers')
  async getFreeChatUsers(@Payload() chatData: IUserChat) {
    const userRoomsData = await this.socketService.getFreeChatUsers(chatData);

    return userRoomsData;
  }

  @MessagePattern('chat/idList')
  async getChatsIdList(@Payload() userId: number) {
    const userRoomsData = await this.socketService.getUserRoomsIds(userId);

    return userRoomsData;
  }
}
