import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  private messages = [
    ''
  ]

  sendConfirmCode(code: string, email: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'nest@exampla.com',
      subject: 'Confirm code',
      html: `<p>your confirm code - ${code}</p>`,
    })
    return true;
  }

  sendPassword(password: string, email: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'nest@exampla.com',
      subject: 'Reseted password',
      html: `<p>your new password - ${password}</p>`,
    })
    return true;
  }
}
