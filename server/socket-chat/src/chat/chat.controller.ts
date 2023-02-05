import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUserChat from 'src/socket/interfaces/user/IUserChat';
import { ChatService } from './chat.service';
import IChatCreate from './interfaces/IChatCreate';
import { UserService } from './user.service';
import IGetContactList from './interfaces/IGetContactList';
import { SocketService } from 'src/socket/socket.service';
import IChatPagination from 'src/socket/interfaces/chat/IChatPagination';
import IChatSearch from 'src/socket/interfaces/chat/IChatSearch';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}

  // @MessagePattern('chat/delete')
  // async remove(@Payload() chatId: string) {
  //   const res = await this.chatService.remove(chatId).catch((err) => {
  //     console.log('err', err);
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   return res;
  // }

  // @MessagePattern('chat/groupUser')
  // async getGroupUser(@Payload() chatId: string) {
  //   const res = await this.chatService.getGroupUsers(chatId).catch((err) => {
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   return res;
  // }

  // @MessagePattern('chat/invaiteToChat')
  // async invaiteUsersToChat(@Payload() invateData: IUserChat) {
  //   const res = await this.chatService
  //     .invaiteUsersToChat(invateData)
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         status: false,
  //         message: err.sqlMessage,
  //         httpCode: HttpStatus.BAD_REQUEST,
  //       };
  //     });
  //   return res;
  // }

  // @MessagePattern('chat/exitUser')
  // async exitUserGroup(@Payload() exitUserData: IUserChat) {
  //   const res = await this.chatService
  //     .exitUserGroup(exitUserData)
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         status: false,
  //         message: err.sqlMessage,
  //         httpCode: HttpStatus.BAD_REQUEST,
  //       };
  //     });
  //   return res;
  // }

  @MessagePattern('chat/contacts')
  async getUserContacts(@Payload() listData: IGetContactList) {
    const res = await this.chatService.getContactList(listData).catch((err) => {
      console.log(err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('chat/usersPrivateChats')
  async getUsersPrivateChats(
    @Payload() privateData: { userId: number; userIdList: number[] },
  ) {
    const res = await this.chatService
      .getUsersPrivateChats(privateData.userId, privateData.userIdList)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('chat/listPagination')
  async getChatsPagination(@Payload() paginationData: IChatPagination) {
    const userRoomsData = await this.chatService
      .getChatPagination(paginationData)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return userRoomsData;
  }

  @MessagePattern('chat/serch')
  async getChatsByPattern(@Payload() searchData: IChatSearch) {
    const userRoomsData = await this.chatService
      .getChatsByPattern(searchData.userId, searchData.pattern)
      .catch((err) => {
        console.log('1', err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    console.log('2', userRoomsData);
    return userRoomsData;
  }

  @MessagePattern('chat/byId')
  async loadChatById(@Payload() loadData: IUserChat) {
    const userRoomsData = await this.socketService
      .getCurrentChatById(loadData.userId, loadData.chatId)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return userRoomsData;
  }

  @MessagePattern('chat/freeUsers')
  async getFreeChatUsers(@Payload() chatData: IUserChat) {
    const userRoomsData = await this.socketService
      .getFreeChatUsers(chatData)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return userRoomsData;
  }

  @MessagePattern('chat/idList')
  async getChatsIdList(@Payload() userId: number) {
    const userRoomsData = await this.socketService
      .getUserRoomsIds(userId)
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return userRoomsData;
  }
}
