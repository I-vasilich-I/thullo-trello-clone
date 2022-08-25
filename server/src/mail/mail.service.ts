import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ACTIVATION_LINK_URL } from '../constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(userName = 'User', email: string, activationLink: string) {
    const url = `${ACTIVATION_LINK_URL}/${activationLink}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account activation',
        template: './activation',
        context: {
          name: userName,
          url,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
