import { ConfirmModule } from '../access/access.module';
import { TokenModule } from '../token/token.module';
import { User } from './user.entity';
import { UserOnline } from './userOnline.entity';
import { UserInfo } from './userInfo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UsersController } from './user.controller';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { UserInfoService } from './userInfo.service';
import { UserOnlineService } from './UserOnline.service';
import { ContactController } from 'src/contacts/contact.controller';
import { Contact } from 'src/contacts/contact.entity';
import { ContactService } from 'src/contacts/contact.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, UserOnline, Contact]),
    forwardRef(() => TokenModule),
    forwardRef(() => ConfirmModule),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT')),
        ttl: 480,
      }),
    }),
  ],
  controllers: [UsersController, ContactController],
  providers: [
    UserService,
    ConfigService,
    AuthService,
    UserInfoService,
    UserOnlineService,
    ContactService
  ],
  exports: [UserService, TypeOrmModule, AuthService],
})
export class UsersModule {}
