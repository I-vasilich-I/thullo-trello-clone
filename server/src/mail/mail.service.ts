import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_ENDPOINTS } from '../constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private config: ConfigService) {}

  async sendActivationMail(userName = 'User', email: string, activationLink: string) {
    const host = this.config.get('APP_HOST');
    const port = this.config.get('PORT');
    const url = `${host}:${port}/${API_ENDPOINTS.ACTIVATE}/${activationLink}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Account activation',
      template: './activation',
      context: {
        name: userName,
        url,
      },
    });
  }
}
