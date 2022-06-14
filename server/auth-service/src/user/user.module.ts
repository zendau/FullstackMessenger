import { ConfirmModule } from '../access/access.module';
import { RoleModule } from '../role/role.module';
import { TokenModule } from '../token/token.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { ClientOpts } from '@nestjs/microservices/external/redis.interface';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TokenModule),
    forwardRef(() => RoleModule),
    forwardRef(() => ConfirmModule),
    CacheModule.register<ClientOpts>({
      store: redisStore,

      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 480
    }),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UsersModule {}
