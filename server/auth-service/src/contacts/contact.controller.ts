import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseIntPipe } from 'src/pipes/parse-int.pipe';
import { ContactService } from './contact.service';
import IContact from './interfaces/IContact';
import IGetContactList from './interfaces/IGetContactList';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @MessagePattern('contact/list')
  async getUserContactList(listData: IGetContactList) {
    const res = await this.contactService
      .getContactList(listData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/freeList')
  async getFreeUserList(listData: IGetContactList) {
    debugger;
    const res = await this.contactService
      .getFreeUsers(listData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/sendRequest')
  async sendContactRequest(@Payload() requestData: IContact) {
    const res = await this.contactService
      .sendContactRequest({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/pending')
  async getContactsRequestPending(listData: IGetContactList) {
    const res = await this.contactService
      .getContactsPending(listData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/outgoing')
  async getContactsRequestOutgoing(@Payload() listData: IGetContactList) {
    const res = await this.contactService
      .getContactsOutgoing(listData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/confirm')
  async confirmUserRequest(@Payload() requestData: IContact) {
    const res = await this.contactService
      .confirmRequest({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/reject')
  async rejectUserRequest(@Payload() requestData: IContact) {
    const res = await this.contactService
      .rejectRequest({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/delete')
  async deleteUserFromContact(@Payload() requestData: IContact) {
    const res = await this.contactService
      .deleteUserFromContact({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/blockedUsers')
  async getBlockedUsers(listData: IGetContactList) {
    const res = await this.contactService
      .getBlockedUsers(listData)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/block')
  async blockUserContact(@Payload() requestData: IContact) {
    const res = await this.contactService
      .blockUser({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/unblock')
  async unblockUserContact(@Payload() requestData: IContact) {
    const res = await this.contactService
      .unblockUser({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('contact/getContactData')
  async getContactData(@Payload() requestData: IContact) {
    const res = await this.contactService
      .getContactData({
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }
}
