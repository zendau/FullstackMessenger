import { ConfirmModule } from './../confirm/confirm.module';
import { RoleModule } from '../role/role.module';
import { TokenModule } from '../token/token.module';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TokenModule),
    forwardRef(() => RoleModule),
    forwardRef(() => ConfirmModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
