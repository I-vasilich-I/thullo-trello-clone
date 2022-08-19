import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

class MailerServiceFake {
  public sendMail(): void {
    return;
  }
}

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;
  let sendMailSpy: any;

  beforeAll(async () => {
    const MailerProvider = {
      provide: MailerService,
      useClass: MailerServiceFake,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, MailerProvider, ConfigService],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get(MailerService);
    sendMailSpy = jest.spyOn(mailerService, 'sendMail');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('calls sendMail method', async () => {
    await service.sendActivationMail('User', 'email@test.com', 'url');
    expect(sendMailSpy).toBeCalled();
  });
});
