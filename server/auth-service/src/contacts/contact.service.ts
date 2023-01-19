import { Connection, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { UserService } from 'src/user/user.service';
import { union } from 'src/utils/typeorm/union';
import { User } from 'src/user/user.entity';
import IGetContactList from './interfaces/IGetContactList';
import IContact from './interfaces/IContact';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async isVerifiedConctacts(veridiedData: IContact) {
    const res = await this.contactRepository.findOne({
      where: {
        userId: veridiedData.userId,
        contactId: veridiedData.contactId,
      },
    });
    console.log('res', res, veridiedData);

    return res;
  }

  async getContactList(listData: IGetContactList) {
    debugger;
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('contactId as id')
      .where('userId = :userId', { userId: listData.userId })
      .andWhere('isContact = 1');

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      listData.userId,
      false,
      listData.page,
      listData.limit,
      listData.pattern,
    );
    return resList;
  }

  async getFreeUsers(listData: IGetContactList) {
    debugger;
    const subContacts = this.contactRepository
      .createQueryBuilder()
      .select('contactId as id')
      .where('userId = :userId', { userId: listData.userId });

    const subUsers = this.contactRepository
      .createQueryBuilder()
      .select('userId')
      .where('contactId = :userId', { userId: listData.userId });

    const freeUsersUnion = union(subContacts, subUsers);

    const freeUsersList = await this.userService.getOtherUsersList(
      freeUsersUnion,
      listData.userId,
      true,
      listData.page,
      listData.limit,
      listData.pattern,
    );
    return freeUsersList;
  }

  async sendContactRequest(requestData: IContact) {
    const checkContact = await this.isVerifiedConctacts({
      contactId: requestData.contactId,
      userId: requestData.userId,
    });

    console.log('check', checkContact);

    if (checkContact) {
      return {
        status: true,
        message: 'Is already contact',
      };
    }

    const res = await this.contactRepository.save({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });
    return res;
  }

  async getContactsPending(listData: IGetContactList) {
    // SELECT * FROM test.contact c WHERE c.userId = 1 AND c.contactId  NOT IN  (SELECT c2.userId  FROM  test.contact c2 WHERE c2.contactId = 1 )

    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('userId')
      .where('contactId = :userId', { userId: listData.userId })
      .andWhere('isContact = 0')
      .andWhere('isBanned = 0');
    // const resList = await this.contactRepository
    //   .createQueryBuilder()
    //   .select('contactId as id')
    //   .where(`contactId NOT IN (${subQuery.getQuery()})`)
    //   .andWhere('userId = :userId', { userId });

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      listData.userId,
      false,
      listData.page,
      listData.limit,
      listData.pattern,
    );
    return resList;

    //return resList;
  }

  async getContactsOutgoing(listData: IGetContactList) {
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('contactId')
      .where('userId = :userId', { userId: listData.userId })
      .andWhere('isContact = 0')
      .andWhere('isBanned = 0');

    // const resList = await this.contactRepository
    //   .createQueryBuilder()
    //   .select('userId as id')
    //   .where(`userId NOT IN (${subQuery.getQuery()})`)
    //   .andWhere('contactId = :userId', { userId });

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      listData.userId,
      false,
      listData.page,
      listData.limit,
      listData.pattern,
    );
    return resList;
  }

  async getUserContactsCount(userId: number) {
    const contactsCount = await this.contactRepository
      .createQueryBuilder()
      .select('COUNT(contactId)', 'count')
      .where('userId = :userId', { userId })
      .andWhere('isContact = 1')
      .getRawOne();

    console.log('1', contactsCount);

    const pendingCount = await this.contactRepository
      .createQueryBuilder()
      .select('COUNT(userId)', 'count')
      .where('contactId = :userId', { userId })
      .andWhere('isContact = 0')
      .andWhere('isBanned = 0')
      .getRawOne();

    const outgoingCount = await this.contactRepository
      .createQueryBuilder()
      .select('COUNT(userId)', 'count')
      .where('userId = :userId', { userId })
      .andWhere('isContact = 0')
      .andWhere('isBanned = 0')
      .getRawOne();

    const blockedCount = await this.contactRepository
      .createQueryBuilder()
      .select('COUNT(contactId)', 'count')
      .where('userId = :userId', { userId })
      .andWhere('isBanned = 1')
      .getRawOne();

    return {
      contacts: contactsCount.count,
      pendingRequests: pendingCount.count,
      outgoingRequests: outgoingCount.count,
      blockedUsers: blockedCount.count,
    };
  }

  async confirmRequest(requestData: IContact) {
    await this.sendContactRequest({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });

    const res = await this.contactRepository
      .createQueryBuilder()
      .update()
      .set({
        isContact: true,
      })
      .where('userId IN (:...ids) AND contactId IN (:...ids)', {
        ids: [requestData.userId, requestData.contactId],
      })
      .execute();
    return res;
  }

  async rejectRequest(requestData: IContact) {
    const resDeleted = await this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId and contactId = :contactId', {
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .execute();
    return !!resDeleted.affected;
  }

  async deleteUserFromContact(requestData: IContact) {
    debugger;
    const resDeleted = await this.deleteFromContact({
      userId: requestData.userId,
      contactId: requestData.contactId,
    });
    const resChangeIsContact = await this.changeContactStatus(
      requestData.contactId,
      false,
    );

    return resChangeIsContact;
  }

  async deleteFromContact(requestData: IContact) {
    const resDeleted = await this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId and contactId = :contactId', {
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .execute();

    const deletedStatus = !!resDeleted.affected;
    return deletedStatus;
    //if (!deletedStatus) return;
  }

  async changeContactStatus(userId: number, status: boolean) {
    const resUpdated = await this.contactRepository
      .createQueryBuilder()
      .update()
      .set({
        isContact: status,
      })
      .where('userId = :userId', { userId })
      .execute();

    const updatedStatus = !!resUpdated.affected;

    if (!updatedStatus) {
      return {
        status: false,
        message: `Wrong user id - ${userId} contact data`,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    return {
      status: true,
    };
  }

  async getBlockedUsers(listData: IGetContactList) {
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('contactId')
      .where('userId = :userId', { userId: listData.userId })
      .andWhere('isBanned = 1');

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      listData.userId,
      false,
      listData.page,
      listData.limit,
      null,
    );
    return resList;
  }

  async blockUser(requestData: IContact) {
    debugger;
    const resUpdate = await this.contactRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: true,
        isContact: false,
      })
      .where('userId = :userId and contactId = :contactId', {
        userId: requestData.userId,
        contactId: requestData.contactId,
      })
      .execute();

    const upadtedStatus = !!resUpdate.affected;
    console.log('upadtedStatus', upadtedStatus);

    if (!upadtedStatus) {
      await this.contactRepository.save({
        contactId: requestData.contactId,
        userId: requestData.userId,
        isBanned: true,
      });
    }

    // if (!upadtedStatus) {
    //   return {
    //     status: false,
    //     message: 'Wrong block contact data',
    //     httpCode: HttpStatus.BAD_REQUEST,
    //   };
    // }

    await this.deleteFromContact({
      userId: requestData.contactId,
      contactId: requestData.userId,
    });

    return true;
  }

  async unblockUser(requestData: IContact) {
    const res = await this.deleteFromContact({
      contactId: requestData.contactId,
      userId: requestData.userId,
    });
    // const resUpdate = await this.contactRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     isBanned: false,
    //   })
    //   .where('userId = :contactId and contactId = :userId', {
    //     userId,
    //     contactId,
    //   })
    //   .execute();

    return res;
  }

  async getContactData(requestData: IContact) {
    const contactData = await this.userService.getUserById(
      requestData.contactId,
    );

    if (!(contactData instanceof User)) return contactData;
    debugger;
    const resStatus = Object.assign(contactData, {
      isBanned: false,
      isBannedByContact: false,
      isFriend: false,
      isConfirmRequest: false,
      isPendingRequest: false,
    });

    const userStatus = await this.contactRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId: requestData.userId })
      .andWhere('contactId = :contactId', { contactId: requestData.contactId })
      .getOne();

    if (userStatus?.isBanned) {
      resStatus.isBanned = true;
      return resStatus;
    }

    if (userStatus?.isContact) {
      resStatus.isFriend = true;
      return resStatus;
    } else if (userStatus?.isContact === false) {
      resStatus.isPendingRequest = true;
      return resStatus;
    }

    const contactStatus = await this.contactRepository
      .createQueryBuilder()
      .where('contactId = :userId', { userId: requestData.userId })
      .andWhere('userId = :contactId', { contactId: requestData.contactId })
      .getOne();

    if (contactStatus?.isBanned) {
      resStatus.isBannedByContact = true;
      return resStatus;
    }

    if (contactStatus?.isContact === false) {
      resStatus.isConfirmRequest = true;
      return resStatus;
    }
    return resStatus;
    // async getUserRequest(userId: number) {
    //   const usersList = await this.userSerivce.getAllUsers()
    //   const contactsList = await this.getContactList(userId)
    //   console.log(userId, typeof userId)
    //   const freeUsersList = usersList.filter((item) => !contactsList.includes(item) && item.id !== userId && !item.isBanned)
    //   return freeUsersList

    // }
  }
}
