import { ConfirmModule } from '../access/access.module';
import { TokenModule } from '../token/token.module';
import { User } from './user.entity';
import { UserOnline } from './userOnline.entity';
import { UserInfo } from './userInfo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UsersController } from './user.controller';
import { ConfigService } from '@nestjs/config';
import { UserInfoService } from './userInfo.service';
import { ContactController } from 'src/contacts/contact.controller';
import { Contact } from 'src/contacts/contact.entity';
import { ContactService } from 'src/contacts/contact.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, UserOnline, Contact]),
    forwardRef(() => TokenModule),
    forwardRef(() => ConfirmModule),
  ],
  controllers: [UsersController, ContactController],
  providers: [
    UserService,
    ConfigService,
    AuthService,
    UserInfoService,
    ContactService
  ],
  exports: [UserService, TypeOrmModule, AuthService],
})
export class UsersModule {}
