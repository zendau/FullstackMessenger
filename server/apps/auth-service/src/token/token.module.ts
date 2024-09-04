import { JwtModule } from '@nestjs/jwt';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/user/user.module';
import { TokenService } from '@/token/token.service';
import { Token } from '@/token/token.entity';
import { Device } from '@/token/device.entity';
import { DeviceService } from '@/token/device.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Device]),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  providers: [TokenService, DeviceService],
  exports: [TokenService, DeviceService],
})
export class TokenModule {}
