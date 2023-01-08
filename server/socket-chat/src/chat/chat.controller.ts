import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import IUserChat from 'src/socket/interfaces/user/IUserChat';
import { ChatService } from './chat.service';
import IChatCreate from './interfaces/IChatCreate';
import { UserService } from './user.service';
import IGetContactList from './interfaces/IGetContactList';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  // @MessagePattern('chat/getByUser')
  // async getChats(@Payload() id: number) {
  //   const res = await this.chatService.getChats(id).catch((err) => {
  //     console.log(err);
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   return res;
  // }

  // @MessagePattern('chat/check')
  // async checkChat(@Payload() chatData: IChatCreate) {
  //   const res = await this.chatService.checkChat(chatData).catch((err) => {
  //     console.log(err);
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   return res;
  // }

  // @MessagePattern('chat/checkId')
  // async checkChatId(@Payload() id: string) {
  //   const res = await this.chatService.getChatById(id).catch((err) => {
  //     console.log('err', err);
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   console.log('res', res);
  //   return res;
  // }

  // @MessagePattern('chat/create')
  // async createChat(@Payload() chatData: IChatCreate) {
  //   const res = await this.chatService.createChat(chatData).catch((err) => {
  //     console.log(err);
  //     return {
  //       status: false,
  //       message: err.sqlMessage,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   console.log('res', res);
  //   return res;
  // }

  // @MessagePattern('chat/getContacts')
  // async getContacts() {
  //   const res = await this.userService.getContacts().catch((err) => {
  //     return {
  //       status: false,
  //       message: err,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   });
  //   return res;
  // }

  @MessagePattern('chat/delete')
  async remove(@Payload() chatId: string) {
    const res = await this.chatService.remove(chatId).catch((err) => {
      console.log('err', err);
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('chat/groupUser')
  async getGroupUser(@Payload() chatId: string) {
    const res = await this.chatService.getGroupUsers(chatId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  // @MessagePattern('chat/invaitedUsers')
  // async getInvaitedUsers(@Payload() usersIdList: number[]) {
  //   const res = await this.userService
  //     .getInvaitedUsers(usersIdList)
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

  @MessagePattern('chat/invaiteToChat')
  async invaiteUsersToChat(@Payload() invateData: IUserChat) {
    const res = await this.chatService
      .invaiteUsersToChat(invateData)
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

  @MessagePattern('chat/exitUser')
  async exitUserGroup(@Payload() exitUserData: IUserChat) {
    const res = await this.chatService
      .exitUserGroup(exitUserData)
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
}
