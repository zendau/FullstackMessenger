import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatUsers } from './entities/chatUsers.entity';
import { UserService } from './user.service';
import { SocketService } from '@/socket/socket.service';
import { SocketRedisAdapter } from '@/socket/socketRedisAdapter.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

jest.mock('rxjs', () => {
  return {
    firstValueFrom: () => Promise.resolve(true),
  };
});

const chatUsersCreateQueryBuilder = jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(null),
  getRawOne: jest.fn().mockResolvedValue({ chat_id: '3' }),
  getRawMany: jest.fn().mockResolvedValue([
    {
      chatId: 1,
    },
    { chatId: 2 },
  ]),
  getMany: jest.fn().mockResolvedValue([]),
  execute: jest.fn().mockResolvedValue({
    affected: true,
  }),
}));

describe('Chat service', () => {
  let service: ChatService;
  let peerServiceClientMock: jest.Mocked<ClientProxy>;
  let fileServiceClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        UserService,
        SocketService,
        SocketRedisAdapter,
        {
          provide: getRepositoryToken(Chat),
          useValue: {
            createQueryBuilder: () => ({
              innerJoin: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              update: jest.fn().mockReturnThis(),
              delete: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
              getRawMany: jest.fn().mockResolvedValue([
                {
                  userId: 1,
                },
                {
                  userId: 2,
                },
                {
                  userId: 3,
                },
              ]),
              getOne: jest.fn().mockResolvedValue({ title: 'test' }),
              execute: jest.fn().mockResolvedValue({
                affected: true,
              }),
            }),
          },
        },
        {
          provide: getRepositoryToken(ChatUsers),
          useValue: {
            create: jest.fn().mockReturnValue({
              chat: null,
              userId: null,
            }),
            save: jest.fn(),
            createQueryBuilder: chatUsersCreateQueryBuilder,
          },
        },
        {
          provide: 'PEER_SERVICE',
          useValue: {
            connect: jest.fn(),
            send: jest.fn(),
            emit: jest.fn(),
            close: jest.fn(),
          },
        },
        {
          provide: 'FILE_SERVICE',
          useValue: {
            connect: jest.fn(),
            send: jest.fn(),
            emit: jest.fn(),
            close: jest.fn(),
          },
        },
        {
          provide: getConnectionToken(),
          useValue: {
            createQueryRunner: () => ({
              manager: {
                save: (_, chatData) =>
                  Promise.resolve({
                    id: 1,
                    adminId: chatData.adminId,
                    title: chatData.title,
                  }),
              },

              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              connect: jest.fn(),
              startTransaction: jest.fn(),
            }),
          },
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue({
        getUserById: (id) => Promise.resolve({ id, login: `test${id}` }),
        getContactList: () =>
          Promise.resolve({
            resList: {
              1: { userId: 1, login: 'test1' },
              2: { userId: 2, login: 'test2' },
            },
          }),
      })
      .overrideProvider(SocketService)
      .useValue({
        getUserRoomsData: () =>
          Promise.resolve([
            { chatId: '1', title: 'test1' },
            { chatId: '2', title: 'test2' },
          ]),
        getCurrentChatRoom: () => Promise.resolve({}),
      })
      .overrideProvider(SocketRedisAdapter)
      .useValue({
        getListRange: () => Promise.resolve(['1', '2', '3']),
        getValue: () => Promise.resolve('3'),
      })
      .compile();

    peerServiceClientMock = module.get('PEER_SERVICE');
    fileServiceClient = module.get('FILE_SERVICE');
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getChatsIdList success', async () => {
    const res: any = await service.getChatsIdList(1);

    expect(res).toEqual([1, 2]);
  });

  it('getChatPagination success', async () => {
    const res: any = await service.getChatPagination({
      inMemory: 'true',
      limit: '5',
      page: '0',
      userId: 1,
      chatId: '1',
    });

    expect(res.roomsData).toEqual([
      { chatId: '1', title: 'test1' },
      { chatId: '2', title: 'test2' },
    ]);
    expect(res.hasMore).toBe(false);
    expect(res.inMemory).toBe(false);
    expect(res.page).toBe(1);
    expect(res.limit).toBe('5');
    expect(res.currentTempChatData).toEqual({});
  });

  it('getChatById success', async () => {
    peerServiceClientMock.send.mockReturnValueOnce(
      Promise.resolve(true) as any as Observable<boolean>,
    );

    const res: any = await service.getChatById('1');

    expect(res.title).toBe('test');
    expect(res.users).toEqual([1, 2, 3]);
    expect(res.conferenceWithVideo).toBe(true);
  });

  it('createChat success', async () => {
    fileServiceClient.send.mockReturnValueOnce(
      Promise.resolve({ status: true }) as any as Observable<any>,
    );

    const res: any = await service.createChat({
      conferenceType: true,
      users: [2, 3],
      adminId: 1,
      groupName: 'test',
    });

    expect(res.id).toBe(1);
    expect(res.adminId).toBe(1);
    expect(res.title).toBe('test');
  });

  it('remove success', async () => {
    const res: any = await service.remove('1');

    expect(res).toBe(true);
  });

  it('getUsersListData success', async () => {
    const res: any = await service.getUsersListData([1, 2, 3]);

    expect(res).toEqual([
      { id: 1, login: 'test1' },
      { id: 2, login: 'test2' },
      { id: 3, login: 'test3' },
    ]);
  });

  it('invaiteUsersToChat success', async () => {
    const res: any = await service.invaiteUsersToChat({
      chatId: '1',
      userId: 1,
      userLogin: 'test',
      users: [2, 3],
    });

    expect(res).toBe(true);
  });

  it('invaiteUsersToChat error, user already in group', async () => {
    chatUsersCreateQueryBuilder.mockReturnValue({
      ...chatUsersCreateQueryBuilder(),
      getOne: jest.fn().mockReturnValue({}),
    });

    const res: any = await service.invaiteUsersToChat({
      chatId: '1',
      userId: 1,
      userLogin: 'test',
      users: [2, 3],
    });

    expect(res).toBe(false);
  });

  it('exitUserGroup success', async () => {
    const res: any = await service.exitUserGroup({
      chatId: '1',
      userId: 1,
      userLogin: 'test',
      users: [2, 3],
    });

    expect(res).toBe(true);
  });

  it('getChatsByPattern success', async () => {
    const res: any = await service.getChatsByPattern(1, 'test');

    expect(res).toEqual([
      { chatId: '1', title: 'test1' },
      { chatId: '2', title: 'test2' },
    ]);
  });

  it('getContactList success', async () => {
    const res: any = await service.getContactList({
      userId: 1,
      page: '0',
      limit: '5',
    });

    expect(res).toEqual({
      resList: {
        '1': { userId: 1, login: 'test1' },
        '2': { userId: 2, login: 'test2' },
      },
    });
  });

  it('checkPrivateChat success', async () => {
    const res: any = await service.checkPrivateChat(1, 2);

    expect(res).toBe('3');
  });

  it('getPrivateChatId success', async () => {
    const res: any = await service.getPrivateChatId(1, 2);

    expect(res).toBe('3');
  });
});
