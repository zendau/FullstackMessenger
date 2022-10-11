import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './token.entity';
import { Device } from './device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';

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
