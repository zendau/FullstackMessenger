import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'src/message/entities/message.entity';
import IFile from './interfaces/message/IFile';
import IEditMessage from './interfaces/message/IEditMessage';

type redisValue = 'user' | '' | 'room' | 'unread' | 'userContacts';
type redisList = '';
type redisSet = 'userRooms' | 'userContacts' | 'online';
type redisSortedSet = '';
type redisHash = 'message';
type valueData = object | string | number;

@Injectable()
export class SocketRedisAdapter {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private readonly logger = new Logger(SocketRedisAdapter.name);
  private EXPIRE = 60 * 60;

  // String
  async getBranchesSubKeys(key: redisValue, branchId: string | number) {
    const branchesData = await this.redis.keys(`${key}:${branchId}:*`);
    const branchesKeys = branchesData.map((data) => {
      const splitedData = data.split(':');

      if (splitedData.length !== 3) return null;

      return `${splitedData[1]}:${splitedData[2]}`;
    });
    return branchesKeys;
  }

  async getBranchesMainKeys(key: redisValue, subKeyId: string) {
    const branchesData = await this.redis.keys(`${key}:*:${subKeyId}`);
    const branchesKeys = branchesData.map((data) => {
      const splitedData = data.split(':');
      if (splitedData.length !== 3) return null;

      return splitedData[1];
    });
    return branchesKeys;
  }

  async getManyValues(
    key: redisValue,
    mainId: string | number,
    isArray: boolean,
    setQuery: {
      getValuesFromDB: () => Promise<any>;
      isExpire: boolean;
    },
  ) {
    const fieldKeys = await this.getBranchesSubKeys('room', mainId);

    if (fieldKeys.length === 0) {
      if (!setQuery) return null;

      const dbData = await setQuery.getValuesFromDB();
      this.setValues(key, mainId, dbData, setQuery.isExpire);
      console.log('dbData', dbData);
      return dbData;
    }

    const multiPipe = this.redis.multi();
    for (const item of fieldKeys) {
      const valueKey = `${key}:${item}`;
      multiPipe.get(valueKey);
    }

    const resData = await multiPipe.exec();

    if (isArray) {
      const parsedArrayData = resData.map((item) => JSON.parse(item[1]));
      return parsedArrayData;
    }

    const parsedObjectData = resData.reduce(
      (prev, curr, index) => ({
        ...prev,
        [fieldKeys[index]]: JSON.parse(curr[1]),
      }),
      {},
    );

    return parsedObjectData;
  }

  async getValue(
    key: redisValue,
    setQuery: {
      getValuesFromDB: () => Promise<any>;
      isExpire: boolean;
    },
    mainId: string | number,
    subId?: string | number,
  ) {
    const valueKey = `${key}:${mainId}` + (subId ? `:${subId}` : '');
    const resData = await this.redis.get(valueKey);

    if (resData) return JSON.parse(resData);

    if (!setQuery) return null;

    const resDB = await setQuery.getValuesFromDB();

    if (!resDB || 'status' in resDB) throw new Error(resDB.message);

    this.setValue(key, resDB, setQuery.isExpire, mainId);
    return resDB;
  }

  setValues(
    key: redisValue,
    mainId: string | number,
    data: any[],
    withExpire = true,
  ) {
    const multiPipe = this.redis.multi();
    for (const item of data) {
      const valueKey = `${key}:${mainId}:${item.id}`;

      multiPipe.set(valueKey, JSON.stringify(item));
      //this.setValue(key, data[valueId], withExpire, valueId, null);
      if (withExpire) {
        multiPipe.expire(valueKey, this.EXPIRE);
      }
    }

    multiPipe.exec();
  }

  setValue(
    key: redisValue,
    value: valueData,
    withExpire: boolean,
    mainId: string | number,
    subId?: string | number,
  ) {
    const valueKey = `${key}:${mainId}` + (subId ? `:${subId}` : '');

    this.redis.set(valueKey, JSON.stringify(value));
    if (withExpire) {
      this.redis.expire(valueKey, this.EXPIRE);
    }
  }
  async deleteValues(key: redisValue, roomId: string, idList: string[]) {
    const deletedMessages = await Promise.all(
      idList.map(async (id) => await this.deleteValue(key, `${roomId}:${id}`)),
    );
    return deletedMessages;
  }

  async deleteValue(key: redisValue, id: string) {
    const valueKey = `${key}:${id}`;
    const deletedValue = await this.redis.getdel(valueKey);
    return JSON.parse(deletedValue);
  }

  async incValue(
    key: redisValue,
    id: string | number,
    valueId: string,
    incValue: number,
  ) {
    const valueKey = `${key}:${id}:${valueId}`;
    const status = await this.redis.exists(valueKey);
    if (status) {
      this.redis.incrby(valueKey, incValue);
    } else {
      this.redis.set(valueKey, 1);
    }
  }

  async decValue(
    key: redisValue,
    id: string,
    valueId: string,
    decValue: number,
  ) {
    const valueKey = `${key}:${id}:${valueId}`;
    const status = await this.redis.exists(valueKey);
    if (status) {
      this.redis.decrby(valueKey, decValue);
    } else {
      this.redis.set(valueKey, 0);
    }
  }

  // List

  // setListMany(key: redisList, data: object, withExpire = true) {
  //   for (const value in data) {
  //     this.setList(key, value, data[value], withExpire);
  //   }
  // }

  setList(key: redisList, value: number | string, withExpire = true) {
    const valueKey = `${key}`;

    this.redis.rpush(valueKey, value);

    if (withExpire) {
      this.redis.expire(valueKey, this.EXPIRE);
    }
  }

  // async getList(key: redisList, ...idList: string[]) {
  //   if (idList.length === 0) return null;
  //   const valueKey = key + idList.map((id) => `:${id}`).join('');
  //   const listData = await this.redis.lrange(valueKey, 0, -1);
  //   debugger;
  //   if (listData.length === 0) return [];

  //   //this.logger.debug(typeof listData, valueKey);
  //   const parsedData = listData.map((item) => JSON.parse(item));
  //   return parsedData;
  // }

  async isListValueExist(key: redisList, value: string | number) {
    const existStatus = await this.redis.lpos(key, value);
    return !!existStatus;
  }

  async deleteListValue(key: redisList, value: string | number) {
    this.redis.lrem(key, 1, value);
  }

  // Sorted set

  async getSortedSets(key: redisSortedSet, ...idList: string[]) {
    if (idList.length === 0) return null;

    const valueKey = key + idList.map((id) => `:${id}`).join('');
    const hashData = await this.redis.zrange(valueKey, 0, -1);
    const parsedData = Object.keys(hashData).map((key) =>
      JSON.parse(hashData[key]),
    );
    return parsedData;
  }

  async getLastSortedSetValue(key: redisSortedSet, ...idList: string[]) {
    if (idList.length === 0) return null;

    const valueKey = key + idList.map((id) => `:${id}`).join('');
    // zrange key 0 -1
    const hashesData = await this.redis.zrevrangebyscore(
      valueKey,
      '+inf',
      '0',
      'LIMIT',
      0,
      1,
    );

    if (hashesData.length === 1) return JSON.parse(hashesData[0]);
    return null;
  }

  // async getSortedSetById(key: redisHash, valueId: string, field: string) {
  //   const valueKey = `${key}:${valueId}`;
  //   const hashData = await this.redis.hget(valueKey, field);

  //   return JSON.parse(hashData);
  // }

  setSortedSet(
    key: redisSortedSet,
    id: string,
    score: string,
    value: valueData,
    withExpire = true,
  ) {
    const valueKey = `${key}:${id}`;
    this.redis.zadd(valueKey, 'NX', score, JSON.stringify(value));
    if (withExpire) {
      this.redis.expire(valueKey, this.EXPIRE);
    }
  }

  // fix
  async editSortedSet(
    key: redisSortedSet,
    id: string,
    score: string,
    value: valueData,
  ) {
    const valueKey = `${key}:${id}`;
    this.redis.zadd(valueKey, 'XX', score, JSON.stringify(value));
  }

  async deleteSortedSets(key: redisSortedSet, id: string, scoreList: string[]) {
    scoreList.map(async (score) => await this.deleteSortedSet(key, id, score));
  }

  async deleteSortedSet(key: redisSortedSet, id: string, score: string) {
    const valueKey = `${key}:${id}`;
    this.redis.zremrangebyscore(valueKey, score, score);
  }

  // Set

  setManySetValue(
    key: redisSet,
    id: string | number | null,
    values: (string | number)[],
    withExpire: boolean,
  ) {
    const valueKey = key + (id ? `:${id}` : '');

    this.redis.sadd(valueKey, values);

    if (withExpire) {
      this.redis.expire(valueKey, this.EXPIRE);
    }
  }

  setSetValue(key: redisSet, value: string | number, withExpire: boolean) {
    this.redis.sadd(key, value);

    if (withExpire) {
      this.redis.expire(key, this.EXPIRE);
    }
  }

  async getSetValue(
    key: redisSet,
    setQuery: {
      getValuesFromDB: () => Promise<any[]>;
      isExpire: boolean;
    },
    mainId: string | number,
    subId?: string | number,
  ) {
    const valueKey = `${key}:${mainId}` + (subId ? `:${subId}` : '');

    const setData = await this.redis.smembers(valueKey);

    if (setData.length > 0) return setData;

    if (!setQuery) return null;

    const resList = await setQuery.getValuesFromDB();

    if (resList.length === 0 || 'status' in resList) return [];

    this.setManySetValue(key, mainId, resList, setQuery.isExpire);
    return resList;
  }

  async isSetValueExist(
    key: redisSet,
    id: string | number | null,
    member: string | number,
  ) {
    const valueKey = key + (id ? `:${id}` : '');

    const existStatus = await this.redis.sismember(valueKey, member.toString());
    return !!existStatus;
  }

  deleteSetValue(
    key: redisSet,
    id: string | number | null,
    member: string | number,
  ) {
    const valueKey = key + (id ? `:${id}` : '');

    this.redis.srem(valueKey, member);
  }

  // Hash

  async getHashes(
    key: redisHash,
    setQuery: {
      getValuesFromDB: () => Promise<any>;
      isExpire: boolean;
    },
    valueId: string | number,
    offset: number,
    limit: number,
  ) {
    const valueKey = `${key}:${valueId}`;

    const messagesRange = await this.redis.lrange(
      `map-${valueKey}`,
      offset,
      limit,
    );

    if (messagesRange.length > 0) {
      const hashData = await this.redis.hmget(valueKey, messagesRange);

      if (hashData) {
        const parsedData = Object.keys(hashData).map((key) =>
          JSON.parse(hashData[key]),
        );
        return parsedData;
      }
    }

    if (!setQuery) return null;

    const resDB = await setQuery.getValuesFromDB();

    if (!resDB || 'status' in resDB) return null;

    this.setHashValues(key, valueId, resDB, setQuery.isExpire);
    return resDB;
  }

  async getLastHashValue(
    key: redisHash,
    setQuery: {
      getValuesFromDB: () => Promise<any>;
      isExpire: boolean;
    },
    valueId: string | number,
  ) {
    const valueKey = `${key}:${valueId}`;

    const lastMessageKey = await this.redis.lrange(`map-${valueKey}`, -1, -1);

    if (lastMessageKey.length > 0) {
      const lastMessage = await this.redis.hget(valueKey, lastMessageKey[0]);
      return JSON.parse(lastMessage);
    }

    if (!setQuery) return null;

    const resDB = await setQuery.getValuesFromDB();

    if (!resDB || 'status' in resDB) return null;

    return resDB;
  }

  async getHashById(
    key: redisHash,
    setQuery: {
      getValuesFromDB: () => Promise<any>;
      isExpire: boolean;
    },
    valueId: string | number,
    field: string,
  ) {
    const valueKey = `${key}:${valueId}`;
    const hashData = await this.redis.hget(valueKey, field);

    if (hashData) return JSON.parse(hashData);

    if (!setQuery) return null;

    const resDB = await setQuery.getValuesFromDB();

    if (!resDB || 'status' in resDB) return null;

    this.setHashValue(key, valueId, field, resDB, setQuery.isExpire);
    return resDB;
  }

  setHashValue(
    key: redisHash,
    id: string | number,
    field: string | number,
    value: valueData,
    withExpire: boolean,
  ) {
    const valueKey = `${key}:${id}`;

    const multiPipe = this.redis.multi();

    multiPipe.hset(valueKey, field, JSON.stringify(value));
    multiPipe.rpush(`map-${valueKey}`, field);
    if (withExpire) {
      multiPipe.expire(valueKey, this.EXPIRE);
      multiPipe.expire(`map-${valueKey}`, this.EXPIRE);
    }

    multiPipe.exec();
  }

  setHashValues(
    key: redisHash,
    id: string | number,
    values: any[],
    withExpire: boolean,
  ) {
    const valueKey = `${key}:${id}`;

    const hashData = values.reduce(
      (obj, item) => ({ ...obj, [item.id]: item }),
      {},
    );

    this.redis.hmset(valueKey, hashData);
    if (withExpire) {
      this.redis.expire(valueKey, this.EXPIRE);
    }
  }

  async editHashValueMessage(
    editQuery: {
      editValuesFromDB: () => Promise<any>;
    },
    editMessageData: IEditMessage,
  ) {
    const valueKey = `message:${editMessageData.roomId}`;
    const messageData = await this.redis.hget(
      valueKey,
      editMessageData.messageId,
    );
    if (!messageData) {
      if (!editQuery) return null;

      const updatedStatus = await editQuery.editValuesFromDB();
      return updatedStatus;
    }

    const parsedMessage = JSON.parse(messageData);
    parsedMessage.text = editMessageData.updatedText;
    parsedMessage.isEdited = true;

    if (editMessageData.deletedFiles) {
      parsedMessage.files = parsedMessage.files.filter(
        (file) => !editMessageData.deletedFiles.includes(file.id),
      );
    }

    if (editMessageData.files) {
      parsedMessage.files.push(...editMessageData.files);
    }

    this.redis.hset(
      valueKey,
      editMessageData.messageId,
      JSON.stringify(parsedMessage),
    );

    return true;
  }

  deleteHashMany(
    key: redisHash,
    deleteQuery: {
      deleteValuesFromDB: () => Promise<any>;
    },
    id: string,
    fieldsList: string[],
  ) {
    const valueKey = `${key}:${id}`;
    const multiPipe = this.redis.multi();

    fieldsList.forEach((field) => {
      multiPipe.hdel(valueKey, field);
      multiPipe.lrem(`map-${valueKey}`, 1, field);
    });

    multiPipe.exec();
    deleteQuery.deleteValuesFromDB();

    //fieldsList.map((field) => this.deleteHashValue(key, id, field));
  }

  deleteHashValue(key: redisHash, id: string, field: string) {
    const valueKey = `${key}:${id}`;
    this.redis.hdel(valueKey, field);
  }
}
