import { Module } from '@nestjs/common';
import { UsersModule } from '@/user/user.module';
import { AdminController } from '@/admin/admin.controller';
import { AdminService } from '@/admin/admin.service';
import { ConfirmModule } from '@/access/access.module';

@Module({
  imports: [UsersModule, ConfirmModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
