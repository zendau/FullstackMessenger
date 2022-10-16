import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContactService } from './contact.service';
import IContact from './interfaces/IContact';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @MessagePattern('contact/list')
  async getUserContactList(@Payload() userId: string) {
    const res = await this.contactService
      .getContactList(parseInt(userId))
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
  async getFreeUserList(@Payload() userId: string) {
    const res = await this.contactService
      .getFreeUsers(parseInt(userId))
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
      .sendContactRequest(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
  async getContactsRequestPending(@Payload() userId: string) {
    const res = await this.contactService
      .getContactsPending(parseInt(userId))
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
  async getContactsRequestOutgoing(@Payload() userId: string) {
    const res = await this.contactService
      .getContactsOutgoing(parseInt(userId))
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
      .confirmRequest(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
      .rejectRequest(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
      .deleteFromContact(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
      .blockUser(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
      .unblockUser(
        parseInt(requestData.userId),
        parseInt(requestData.contactId),
      )
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
