import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContactService } from '@/contacts/contact.service';
import IContact from '@/contacts/interfaces/IContact';
import IUserPaginationList from '@/contacts/interfaces/IUserPaginationList';

import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
@Controller()
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private contactService: ContactService) {}

  @MessagePattern('contact/list')
  async getUserContactList(listData: IUserPaginationList) {
    const res = await this.contactService.getContactList(listData);

    return res;
  }

  @MessagePattern('contact/freeList')
  async getFreeUserList(listData: IUserPaginationList) {
    const res = await this.contactService.getFreeUsers(listData);

    return res;
  }

  @MessagePattern('contact/sendRequest')
  async sendContactRequest(@Payload() requestData: IContact) {
    const res = await this.contactService.sendContactRequest({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/pending')
  async getContactsRequestPending(listData: IUserPaginationList) {
    const res = await this.contactService.getContactsPending(listData);

    return res;
  }

  @MessagePattern('contact/outgoing')
  async getContactsRequestOutgoing(@Payload() listData: IUserPaginationList) {
    const res = await this.contactService.getContactsOutgoing(listData);

    return res;
  }

  @MessagePattern('contact/confirm')
  async confirmUserRequest(@Payload() requestData: IContact) {
    const res = await this.contactService.confirmRequest({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/reject')
  async rejectUserRequest(@Payload() requestData: IContact) {
    const res = await this.contactService.rejectRequest({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/delete')
  async deleteUserFromContact(@Payload() requestData: IContact) {
    const res = await this.contactService.deleteUserFromContact({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/blockedUsers')
  async getBlockedUsers(listData: IUserPaginationList) {
    const res = await this.contactService.getBlockedUsers(listData);

    return res;
  }

  @MessagePattern('contact/block')
  async blockUserContact(@Payload() requestData: IContact) {
    const res = await this.contactService.blockUser({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/unblock')
  async unblockUserContact(@Payload() requestData: IContact) {
    const res = await this.contactService.unblockUser({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }

  @MessagePattern('contact/getContactData')
  async getContactData(@Payload() requestData: IContact) {
    const res = await this.contactService.getContactData({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    return res;
  }
  @MessagePattern('contact/getContactCount')
  async getUserContactsCount(@Payload() userId: number) {
    const res = await this.contactService.getUserContactsCount(userId);

    return res;
  }
}
