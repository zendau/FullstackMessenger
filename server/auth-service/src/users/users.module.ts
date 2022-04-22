import { RoleModule } from './../role/role.module';
import { RoleService } from './../role/role.service';
import { TokenModule } from './../token/token.module';
import { TokenService } from './../token/token.service';
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
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
