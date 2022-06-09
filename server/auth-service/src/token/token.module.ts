import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
