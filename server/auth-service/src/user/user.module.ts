import { ConfirmModule } from '../access/access.module';
import { RoleModule } from '../role/role.module';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, UserOnline]),
    forwardRef(() => TokenModule),
    forwardRef(() => RoleModule),
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
  controllers: [UsersController],
  providers: [
    UserService,
    ConfigService,
    AuthService,
    UserInfoService,
    UserOnlineService,
  ],
  exports: [UserService, TypeOrmModule, AuthService],
})
export class UsersModule {}
