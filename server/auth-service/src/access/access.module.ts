import { Module } from '@nestjs/common';
import { ConfirmCodeService } from './access-confirm/access-confirm';
import { NodeMailerService } from './nodemailer/nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './access.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccess]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: configService.get('MAILER_PORT'),
          auth: {
            user: configService.get('MAILER_EMAIL'),
            pass: configService.get('MAILER_PASSWORD'),
          }
        },
    })

    }),
  ],
  providers: [ConfirmCodeService, NodeMailerService, ConfigService],
  exports: [ConfirmCodeService, NodeMailerService, TypeOrmModule],
})
export class ConfirmModule { }
