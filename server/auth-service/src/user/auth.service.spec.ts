import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserInfoService } from './userInfo.service';
import { NodeMailerService } from '@/access/nodemailer/nodemailer.service';
import { HttpStatus } from '@nestjs/common';
import * as passwordFactory from '@/utils/passwordFactory';

describe('Auth service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue({
              id: null,
              email: null,
              login: null,
              password: null,
              access: null,
              info: null,
              lastOnline: null,
              role: null,
            }),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: () => ({
              leftJoin: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
              execute: jest.fn().mockResolvedValue({
                affected: true,
              }),
            }),
          },
        },
        TokenService,
        UserService,
        NodeMailerService,
        ConfirmCodeService,
        UserInfoService,
        {
          provide: getConnectionToken(),
          useValue: {
            createQueryRunner: () => ({
              manager: {
                save: (userData) =>
                  jest.fn().mockReturnValue({
                    ...userData,
                    id: 1,
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
      .overrideProvider(TokenService)
      .useValue({
        findTokenAndGet: (refreshToken: string, deviceTag: string) => {
          if (refreshToken && deviceTag) {
            return new Promise((res) =>
              res({
                status: true,
                userData: {},
                deviceId: 1,
              }),
            );
          }

          return new Promise((res) =>
            res({
              status: false,
              message: 'error.notAuth',
              httpCode: HttpStatus.UNAUTHORIZED,
            }),
          );
        },
        insertTokens: () => {
          return new Promise((res) =>
            res({
              accessToken: 'newAccessToken',
              refreshToken: 'newRefreshToken',
            }),
          );
        },
      })
      .overrideProvider(UserService)
      .useValue({
        findByEmail: (email) =>
          new Promise((res) => {
            if (email === 'email') {
              return res({
                status: true,
                userData: {
                  id: 1,
                  email: 'email',
                  login: 'login',
                  role: 'admin',
                  password: 'password',
                },
              });
            }

            return res({
              status: false,
              message: ['error.undefinedEmail', email],
              httpCode: HttpStatus.BAD_REQUEST,
            });
          }),
        getAdditionalUserData: () =>
          new Promise((res) =>
            res({
              bannedStatus: { isBanned: false },
              userInfo: null,
            }),
          ),
      })
      .overrideProvider(NodeMailerService)
      .useValue({
        sendPassword: jest.fn(),
      })
      .overrideProvider(ConfirmCodeService)
      .useValue({
        checkConfirmCode: (code) =>
          new Promise((res) => {
            if (code === '123')
              res({
                status: true,
              });

            res({
              status: false,
              message: 'error.confirmCodeValid',
              httpCode: HttpStatus.BAD_REQUEST,
            });
          }),
        initAcceesNote: (userData: User) =>
          new Promise((res) =>
            res({
              confirmCode: 'confirm',
              user: userData,
            }),
          ),
        deleteConfirmCode: () => new Promise((res) => res(null)),
      })
      .overrideProvider(UserInfoService)
      .useValue({
        add: () =>
          new Promise((res) => res({ phone: 'phone', details: '123' })),
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('refreshToken success', async () => {
    const res: any = await service.refreshToken({
      device: {
        ip: '1.1.1.1',
        system: { userAgent: 'test', mobileData: '123' },
      },
      refreshToken: 'testToken',
    });

    expect(res.accessToken).toBe('newAccessToken');
    expect(res.refreshToken).toBe('newRefreshToken');
  });

  it('register success', async () => {
    const res: any = await service.register({
      email: 'email',
      login: 'login',
      password: 'password',
      confirmCode: '123',
      system: {
        ip: '1.1.1.1',
        system: { userAgent: 'test', mobileData: '123' },
      },
    });

    expect(res.accessToken).toBe('newAccessToken');
    expect(res.refreshToken).toBe('newRefreshToken');
  });

  it('register error confirm code', async () => {
    const res: any = await service.register({
      email: 'email',
      login: 'login',
      password: 'password',
      confirmCode: '1233',
      system: {
        ip: '1.1.1.1',
        system: { userAgent: 'test', mobileData: '123' },
      },
    });

    expect(res.status).toBe(false);
    expect(res.message).toBe('error.confirmCodeValid');
    expect(res.httpCode).toBe(400);
  });

  it('login success', async () => {
    jest.spyOn(passwordFactory, 'comparePassword').mockReturnValue(
      new Promise((res) =>
        res({
          status: true,
        }),
      ),
    );

    const res: any = await service.login({
      email: 'email',
      password: 'password',
    });

    expect(res.accessToken).toBe('newAccessToken');
    expect(res.refreshToken).toBe('newRefreshToken');
  });

  it('login error taken email', async () => {
    jest.spyOn(passwordFactory, 'comparePassword').mockReturnValue(
      new Promise((res) =>
        res({
          status: true,
        }),
      ),
    );

    const res: any = await service.login({
      email: 'email2',
      password: 'password',
    });

    expect(res.status).toBe(false);
    expect(res.message).toEqual(['error.undefinedEmail', 'email2']);
    expect(res.httpCode).toBe(400);
  });

  it('checkEmail - error.takenEmail', async () => {
    const res: any = await service.checkEmail('email');

    expect(res.find).toBe(true);
    expect(res.message).toEqual(['error.takenEmail', 'email']);
  });

  it('checkEmail - error.undefinedEmail', async () => {
    const res: any = await service.checkEmail('email2');

    expect(res.find).toBe(false);
    expect(res.message).toEqual(['error.undefinedEmail', 'email2']);
  });

  it('resetUserPassword - success', async () => {
    const res: any = await service.resetUserPassword({
      confirmCode: '123',
      email: 'email',
    });

    expect(res).toBe(true);
  });
});
