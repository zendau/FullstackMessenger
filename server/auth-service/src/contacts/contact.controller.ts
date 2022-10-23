import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseIntPipe } from 'src/pipes/parse-int.pipe';
import { ContactService } from './contact.service';
import IContact from './interfaces/IContact';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @MessagePattern('contact/list')
  async getUserContactList(@Payload(new ParseIntPipe()) userId: number) {
    const res = await this.contactService
      .getContactList(userId)
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
  async getFreeUserList(@Payload(new ParseIntPipe()) userId: number) {
    const res = await this.contactService
      .getFreeUsers(userId)
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
  async getContactsRequestPending(@Payload(new ParseIntPipe()) userId: number) {
    const res = await this.contactService
      .getContactsPending(userId)
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
  async getContactsRequestOutgoing(@Payload(new ParseIntPipe()) userId: number) {
    const res = await this.contactService
      .getContactsOutgoing(userId)
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
