import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { DeviceService } from '../token/device.service';
import { ConfirmCodeService } from '../access/access-confirm/access-confirm';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserInfoService } from './userInfo.service';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import { NodeMailerService } from '@/access/nodemailer/nodemailer.service';
import { Token } from '@/token/token.entity';
import { JwtService } from '@nestjs/jwt';
import { Device } from '@/token/device.entity';
import { UserAccess } from '@/access/access.entity';
import { UserInfo } from './userInfo.entity';
import { MailerService } from '@nestjs-modules/mailer';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UserService,
        AuthService,
        TokenService,
        DeviceService,
        ConfirmCodeService,
        UserInfoService,
        NodeMailerService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: () => ({
              leftJoin: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: getRepositoryToken(Token),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Device),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserAccess),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserInfo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRedisConnectionToken(),
          useValue: {},
        },
        {
          provide: getConnectionToken(),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: MailerService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
