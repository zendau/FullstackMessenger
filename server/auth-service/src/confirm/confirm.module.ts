import { Module } from '@nestjs/common';
import { ConfirmCodeService } from './confirm-status/confirm-status.service';
import { NodeMailerService } from './nodemailer/nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confirm } from './confirm.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Confirm]),
    ConfigModule.forRoot(),
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
