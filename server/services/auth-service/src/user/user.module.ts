import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfirmModule } from '@/access/access.module';
import { TokenModule } from '@/token/token.module';
import { User } from '@/user/user.entity';
import { UserInfo } from '@/user/userInfo.entity';
import { UserService } from '@/user/user.service';
import { AuthService } from '@/user/auth.service';
import { UsersController } from '@/user/user.controller';
import { UserInfoService } from '@/user/userInfo.service';
import { ContactController } from '@/contacts/contact.controller';
import { Contact } from '@/contacts/contact.entity';
import { ContactService } from '@/contacts/contact.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, Contact]),
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
