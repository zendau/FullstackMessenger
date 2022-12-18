import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { UserService } from 'src/user/user.service';
import { union } from 'src/utils/typeorm/union';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async isVerifiedConctacts(userId: number, contactId: number) {
    const res = this.contactRepository.findOne({
      where: { userId, contactId },
    });

    return res;
  }

  async getContactList(userId: number) {
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('contactId as id')
      .where('userId = :userId', { userId })
      .andWhere('isContact = 1');

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      userId,
      false,
    );
    return resList;
  }

  async getFreeUsers(userId: number) {
    debugger;
    const subContacts = this.contactRepository
      .createQueryBuilder()
      .select('contactId as id')
      .where('userId = :userId', { userId });

    const subUsers = this.contactRepository
      .createQueryBuilder()
      .select('userId')
      .where('contactId = :userId', { userId });

    const freeUsersUnion = union(subContacts, subUsers);

    const freeUsersList = await this.userService.getOtherUsersList(
      freeUsersUnion,
      userId,
      true,
    );
    return freeUsersList;
  }

  async sendContactRequest(userId: number, contactId: number) {
    const checkContact = await this.isVerifiedConctacts(userId, contactId);

    if (checkContact) {
      return {
        status: true,
        message: 'Is already contact',
      };
    }

    const res = await this.contactRepository.save({
      userId,
      contactId,
    });
    return res;
  }

  async getContactsPending(userId: number) {
    // SELECT * FROM test.contact c WHERE c.userId = 1 AND c.contactId  NOT IN  (SELECT c2.userId  FROM  test.contact c2 WHERE c2.contactId = 1 )

    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('userId')
      .where('contactId = :userId', { userId })
      .andWhere('isContact = 0');
    // const resList = await this.contactRepository
    //   .createQueryBuilder()
    //   .select('contactId as id')
    //   .where(`contactId NOT IN (${subQuery.getQuery()})`)
    //   .andWhere('userId = :userId', { userId });

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      userId,
      false,
    );
    return resList;

    //return resList;
  }

  async getContactsOutgoing(userId: number) {
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('contactId')
      .where('userId = :userId', { userId })
      .andWhere('isContact = 0');

    // const resList = await this.contactRepository
    //   .createQueryBuilder()
    //   .select('userId as id')
    //   .where(`userId NOT IN (${subQuery.getQuery()})`)
    //   .andWhere('contactId = :userId', { userId });

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      userId,
      false,
    );
    return resList;
  }

  async confirmRequest(userId: number, contactId: number) {
    await this.sendContactRequest(userId, contactId);

    const res = await this.contactRepository
      .createQueryBuilder()
      .update()
      .set({
        isContact: true,
      })
      .where('userId IN (:...ids) AND contactId IN (:...ids)', {
        ids: [userId, contactId],
      })
      .execute();
    return res;
  }

  async rejectRequest(userId: number, contactId: number) {
    const resDeleted = await this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId and contactId = :contactId', {
        userId,
        contactId,
      })
      .execute();
    return !!resDeleted.affected;
  }

  async deleteUserFromContact(userId: number, contactId: number) {
    const resDeleted = await this.deleteFromContact(userId, contactId);
    const resChangeIsContact = await this.changeContactStatus(contactId, false);

    return resChangeIsContact;
  }

  async deleteFromContact(userId: number, contactId: number) {
    const resDeleted = await this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId and contactId = :contactId', {
        userId,
        contactId,
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

  async getBlockedUsers(userId: number) {
    const subQuery = this.contactRepository
      .createQueryBuilder()
      .select('userId')
      .where('contactId = :userId', { userId })
      .andWhere('isBanned = 1');

    const resList = await this.userService.getOtherUsersList(
      subQuery,
      userId,
      false,
    );
    return resList;
  }

  async blockUser(userId: number, contactId: number) {
    debugger;
    const resUpdate = await this.contactRepository
      .createQueryBuilder()
      .update()
      .set({
        isBanned: true,
      })
      .where('userId = :contactId and contactId = :userId', {
        userId,
        contactId,
      })
      .execute();

    const upadtedStatus = !!resUpdate.affected;

    if (!upadtedStatus) {
      await this.contactRepository
        .createQueryBuilder()
        .insert()
        .values({
          contactId: userId,
          userId: contactId,
          isBanned: true,
        })
        .execute();
    }

    // if (!upadtedStatus) {
    //   return {
    //     status: false,
    //     message: 'Wrong block contact data',
    //     httpCode: HttpStatus.BAD_REQUEST,
    //   };
    // }

    await this.deleteFromContact(userId, contactId);

    return true;
  }

  async unblockUser(userId: number, contactId: number) {
    const res = await this.deleteFromContact(contactId, userId);
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

  // async getUserRequest(userId: number) {
  //   const usersList = await this.userSerivce.getAllUsers()
  //   const contactsList = await this.getContactList(userId)
  //   console.log(userId, typeof userId)
  //   const freeUsersList = usersList.filter((item) => !contactsList.includes(item) && item.id !== userId && !item.isBanned)
  //   return freeUsersList

  // }
}
