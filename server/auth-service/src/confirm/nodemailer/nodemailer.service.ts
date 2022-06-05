import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  private messages = [
    ''
  ]

  test() {
    this.mailerService.sendMail({
      to: 'cowalyow2012@gmail.com',
      from: 'nest js nodemailer',
      subject: 'test',
      html: '<p>test text2</p>',
    })
    return true;
  }
}
