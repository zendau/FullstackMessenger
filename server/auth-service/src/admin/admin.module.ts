import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ConfirmModule } from 'src/access/access.module';

@Module({
  imports: [UsersModule, ConfirmModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
