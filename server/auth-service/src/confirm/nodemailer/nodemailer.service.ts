import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  private messages = [
    ''
  ]

  send(code: string) {
    this.mailerService.sendMail({
      to: 'cowalyow2012@gmail.com',
      from: 'nest@exampla.com',
      subject: 'Confirm code',
      html: `<p>your confirm code - ${code}</p>`,
    })
    return true;
  }

  sendPassword(password: string) {
    this.mailerService.sendMail({
      to: 'cowalyow2012@gmail.com',
      from: 'nest@exampla.com',
      subject: 'Reseted password',
      html: `<p>your new password - ${password}</p>`,
    })
    return true;
  }
}
