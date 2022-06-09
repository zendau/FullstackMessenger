import { CacheModule, Module } from '@nestjs/common';
import { ConfirmCodeService } from './access-confirm/access-confirm';
import { NodeMailerService } from './nodemailer/nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './access.entity';
import { ConfigModule } from '@nestjs/config';
import { ClientOpts } from '@nestjs/microservices/external/redis.interface';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccess]),
    ConfigModule.forRoot(),
    CacheModule.register<ClientOpts>({
      store: redisStore,

      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 480
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.NODEMAILER_HOST,
        port: parseInt(process.env.NODEMAILER_PORT),
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        }
      },
    }),
  ],
  providers: [ConfirmCodeService, NodeMailerService],
  exports: [ConfirmCodeService, NodeMailerService],
})
export class ConfirmModule { }
